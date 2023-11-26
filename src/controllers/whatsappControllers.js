const { SendMessageWhatsApp } = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../services/tarotServices");
const { createThreadOpenAI } = require("../services/openaiServices");
const { textToSpeech } = require("../services/textToSpeechServices");
const { getUserInFirebase, formatToE164, checkDailyCradit, addNewReading, updateReadingStatus, updateReadingFeedback } = require("../services/firebaseUserServices");

const VerifyToken = (req, res) => {
    try {
        // eslint-disable-next-line no-undef
        const accessToken = process.env.META_TOKEN;
        const token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];

        if(challenge != null && token != null && token == accessToken) {
            res.send(challenge);
        } else {
            res. status(400).send();
        }
    }catch(e){
        console.log(e);
        res. status(400).send();
    }
};

const ReceivedMessage = async(req, res) => {
    try {
        let entry = (req.body["entry"])[0];
        let changes = (entry["changes"])[0];
        let value = (changes["value"]);
        let messageObject = value["messages"];
        let messages;
        let number = '';
        let userMessage = '';
        let whatsappMessageStatus;

        if(typeof messageObject != "undefined"){
            messages = messageObject[0];
            number = messages["from"];
            userMessage = processMessage(messages);
        }        

    
        if (userMessage.toLowerCase().startsWith("pergunta:")) {

            // handle user
            const formattedNumber = formatToE164(number);
            const userRecord = await getUserInFirebase(formattedNumber);
            const dailyCraditResponse = await checkDailyCradit(userRecord.uid);

            // check daily cradit
            if (dailyCraditResponse.on_hold) {
                whatsappMessageStatus = samples.SampleText(number, `Você já fez a sua pergunta do dia. Você precisa esperar *${dailyCraditResponse.hours} horas e ${dailyCraditResponse.minutes} minutos.*`);
                SendMessageWhatsApp(whatsappMessageStatus);
            } else {
                // add new reading
                const readingRef = await addNewReading(userRecord.uid);
               
                
                // sort cards
                const tarotReading = drawTarotCards();
                const tarotCardsArray = Object.values(tarotReading);
                let whatsappMessageCardImage;
                let whatsappMessageCardName;

                // send cards
                tarotCardsArray.forEach((card, index) => {
                    setTimeout(() => {
                        whatsappMessageCardImage = samples.SampleImage(number, card.image);
                        whatsappMessageCardName = samples.SampleText(number, card.name);
                        SendMessageWhatsApp(whatsappMessageCardName);
                        SendMessageWhatsApp(whatsappMessageCardImage);
                    }, 3000 * (index + 1));          
                });

                  // enviar mensagem de status
                    whatsappMessageStatus = samples.SampleText(number, "Zoltar está tirando as cartas");
                    SendMessageWhatsApp(whatsappMessageStatus);
            
                    // enviar pergunta e cartas para o GPT-3
                    sendChatGPTResponse(userMessage, tarotCardsArray, number, userRecord, readingRef);
                   
                    // eviar mesagem de status
                    setTimeout(() => {
                        whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde alguns minutos.");
                        SendMessageWhatsApp(whatsappMessageStatus);
                    }, 15000); 
            }
            
          
        } else if (userMessage.toLowerCase().startsWith("feedback_")) {
            let feedback;
            let readingRef;
            // sprit feedback by "_
            const feedbackRef = userMessage.split("_");
            feedback = feedbackRef[1];
            readingRef = feedbackRef[2];

            updateReadingFeedback(readingRef, feedback);
            whatsappMessageStatus = samples.SampleText(number, "Muito obrigado pelo feedback! Se você quiser contribuir ainda mais com nosso projeto, você pode responder nosso formulário de pesquisa: https://forms.gle/HxyPEQiDPwHfQqzK7")
            SendMessageWhatsApp(whatsappMessageStatus);


        } else if (userMessage.toLowerCase().startsWith("teste")) {
            const formattedNumber = formatToE164(number);
            const userRecord = await getUserInFirebase(formattedNumber);
            const dailyCraditResponse = await checkDailyCradit(userRecord.uid);
            
            if (dailyCraditResponse.on_hold) {
                whatsappMessageStatus = samples.SampleText(number, `Você já fez a sua pergunta do dia. Você precisa esperar *${dailyCraditResponse.hours} horas e ${dailyCraditResponse.minutes} minutos.*`);
                SendMessageWhatsApp(whatsappMessageStatus);
            }

        } else if (userMessage.toLowerCase().startsWith("admin:")) {
        // handle user
        const formattedNumber = formatToE164(number);
        const userRecord = await getUserInFirebase(formattedNumber);

        // add new reading
        const readingRef = await addNewReading(userRecord.uid);
        
        // sort cards
        const tarotReading = drawTarotCards();
        const tarotCardsArray = Object.values(tarotReading);
        let whatsappMessageCardImage;
        let whatsappMessageCardName;

        // send cards
        tarotCardsArray.forEach((card, index) => {
            setTimeout(() => {
                whatsappMessageCardImage = samples.SampleImage(number, card.image);
                whatsappMessageCardName = samples.SampleText(number, card.name);
                SendMessageWhatsApp(whatsappMessageCardName);
                SendMessageWhatsApp(whatsappMessageCardImage);
            }, 3000 * (index + 1));          
        });

        // enviar mensagem de status
            whatsappMessageStatus = samples.SampleText(number, "Zoltar está tirando as cartas");
            SendMessageWhatsApp(whatsappMessageStatus);

            // enviar pergunta e cartas para o GPT-3
            sendChatGPTResponse(userMessage, tarotCardsArray, number, userRecord, readingRef);
        
            // eviar mesagem de status
            setTimeout(() => {
                whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde alguns minutos.");
                SendMessageWhatsApp(whatsappMessageStatus);
            }, 15000); 
        } else if (userMessage.length > 0) {
            const introText = `🌟 *Bem-vindo(a) ao Zoltar Tarot IA* 🌟

Embarque em uma jornada mística com o Zoltar, seu guia no universo enigmático do Tarot. 
Aqui, cada carta revela um fragmento do destino, e cada leitura é um passo em sua jornada pessoal de descoberta.

*Como iniciar sua consulta?* 🌙

_Envie uma mensagem começando com 'pergunta:'_.

Exemplos de mensagens:
pergunta: Qual o segredo por trás do silêncio do meu crush?
pergunta: Que sabedoria devo buscar nesta semana?
pergunta: Quais serão meus obstáculos em 2024?

Ao enviar sua pergunta, Zoltar, com olhos de oráculo, selecionará três cartas do Tarot, tecendo suas respostas com uso de inteligência artificial.

*Lei do Oráculo [1]:* 🌌
Você pode consultar o Zoltar uma vez ao dia. Use esse poder com sabedoria.

*Lei do Oráculo [2]:* 🌠
Seus segredos são sagrados aqui. 
Suas perguntas são envoltas em sigilo, não deixando rastros em nosso santuário digital.

Que as cartas do tarot te ajudem em sua jornada.

💫💫💫`;
            whatsappMessageStatus = samples.SampleText(number,  introText);
            SendMessageWhatsApp(whatsappMessageStatus);
        }
    res.send("EVENT_RECEIVED");
  } catch (e) {
    console.log(e);
    res.send("EVENT_RECEIVED");
  }
};

async function sendChatGPTResponse(userMessage, tarotCardsArray, number, userRecord, readingRef, maxAttempts = 3) {
    let attempt = 0;
    let errorOccurred;
    let error_log;

    while (attempt < maxAttempts) {
        try {
            const OpenAIText = await createThreadOpenAI(userMessage, tarotCardsArray);
            separateTextAndSend(OpenAIText, number, userRecord, readingRef);
            errorOccurred = false;
            break; // Se for bem-sucedido, sai do loop
        } catch (error) {
            errorOccurred = true;
        console.log(`Tentativa ${attempt + 1} falhou:`, error);
            error_log = error;
            attempt++;
        }
    }
    if (errorOccurred) {
        if (attempt >= maxAttempts) {
            // send error message to user 
            const error_msg = "Infelizmente, os servidores estão sobrecarregados e não conseguimos consultar o Zoltar. Por favor, tente novamente mais tarde. Lembre-se, você ainda tem direito à sua pergunta do dia.";
            const whatsappMessageStatus = samples.SampleText(number, error_msg);
            SendMessageWhatsApp(whatsappMessageStatus);

            // update reading status
            await updateReadingStatus(readingRef, 'error', error_log);

            throw new Error(error_msg);
        } else {
            const whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde mais alguns minutos.");
            SendMessageWhatsApp(whatsappMessageStatus);
        } 
    }
}

function separateTextAndSend(text, number, userRecord, readingRef) { 
    const frase = "Zoltar fecha os olhos e, após um breve silêncio, começa a falar:";
    const partes = text.split(frase);
    let whatsappMessageStatus;

    // Verifica se a frase existe no texto
    if (partes.length > 1) {
        whatsappMessageStatus = samples.SampleText(number, partes[0] + frase);
        SendMessageWhatsApp(whatsappMessageStatus);
        sendTextToSpeechResponse(partes[1], number, userRecord, readingRef);

    } else {
        whatsappMessageStatus = samples.SampleText(number, text);
        SendMessageWhatsApp(whatsappMessageStatus);
        // update reading status
        updateReadingStatus(readingRef, 'error', 'Não foi possível separar a frase do texto');
    }
}

async function sendTextToSpeechResponse(OpenAIText, number, userRecord, readingRef) {
    try {
        const audioUrl = await textToSpeech(OpenAIText);
        const audioMessage = samples.SampleAudio(number, audioUrl);
        let whatsappMessageStatus

        SendMessageWhatsApp(audioMessage);        
        // update reading status
        updateReadingStatus(readingRef, 'complete');

        // send status message
        setTimeout(() => {
            whatsappMessageStatus = samples.SampleText(number, `Espero que tenha gostado da sua consulta e que as cartas guiem você em sua jornada.`);
            SendMessageWhatsApp(whatsappMessageStatus);
        }, 10000);

          // send status message
        setTimeout(() => {
            whatsappMessageStatus = samples.SampleEvaluation(number, readingRef);
            SendMessageWhatsApp(whatsappMessageStatus);
        }, 11000);


    } catch (error) {
        console.log(error);
    }
}


function processMessage(messages) {
    var text = "";
    var typeMessge = messages["type"];
    if(typeMessge == "text"){
        text = (messages["text"])["body"];
    }
    else if(typeMessge == "interactive"){

        var interactiveObject = messages["interactive"];
        var typeInteractive = interactiveObject["type"];
        
        if(typeInteractive == "button_reply"){
            text = (interactiveObject["button_reply"])["id"];
        }
        else if(typeInteractive == "list_reply"){
            text = (interactiveObject["list_reply"])["id"];
        }else{
            console.log("sem mensagem");
        }
    }else {
        console.log("sem mensagem");
    }
    return text;
}

module.exports = {
  VerifyToken,
  ReceivedMessage,
};
