const { SendMessageWhatsApp } = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../services/tarotServices");
const { createThreadOpenAI } = require("../services/openaiServices");
const { textToSpeech } = require("../services/textToSpeechServices");
const { createUserInFirebase, formatToE164, createUserOrUpdateUserRecord } = require("../services/firebaseUserServices");

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
        let messages = messageObject[0];
        let number = messages["from"];
        let userText = messages.text.body;

        const tarotReading = drawTarotCards();
        const tarotCardsArray = Object.values(tarotReading);

        const formattedNumber = formatToE164(number);

        await createUserInFirebase(formattedNumber);

        const userRecord = await createUserInFirebase(formattedNumber);

        let lastReadingTimestamp = Date.now(); 
        let evaluationScore =  ""
        let evaluationTimestamp = "";

        await createUserOrUpdateUserRecord(userRecord.uid, lastReadingTimestamp, evaluationScore, evaluationTimestamp);
        

        let whatsappMessageCardImage;
        let whatsappMessageCardName;
        let whatsappMessageStatus;

        if (userText.toLowerCase().startsWith("pergunta:")) {
            // enviar mensagem de status
            whatsappMessageStatus = samples.SampleText(number, "Zoltar está tirando as cartas");
            SendMessageWhatsApp(whatsappMessageStatus);

            // enviar mensagem de pergunta para chatGPT 

              
            // Chame a função com os argumentos apropriados
            sendChatGPTResponse(userText, tarotCardsArray, number);
            // sortear e enviar cartas
            tarotCardsArray.forEach((card, index) => {

                setTimeout(() => {
                    whatsappMessageCardImage = samples.SampleImage(number, card.image);
                    whatsappMessageCardName = samples.SampleText(number, card.name);
                    SendMessageWhatsApp(whatsappMessageCardName);
                    SendMessageWhatsApp(whatsappMessageCardImage);
                }, 3000 * (index + 1));
                
            });

            setTimeout(() => {
                whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde alguns minutos.");
                SendMessageWhatsApp(whatsappMessageStatus);
            }, 15000);

            if (userText.includes("⭐")) {
                evaluationScore = Number(userText)
                evaluationTimestamp = new Date().toISOString();
            
                await createUserOrUpdateUserRecord(
                    userRecord.uid,
                    lastReadingTimestamp,
                    evaluationScore,
                    evaluationTimestamp
                );
            }        

        } else {
            whatsappMessageStatus = samples.SampleText(number,  "Olá,\n\nSeja bem-vindo(a) ao *Zoltar Tarot IA*.\nSomos uma maneira acessível de você consultar a sabedoria do Tarot.\n\n*Como funciona?:*\nPara fazer um consultar, é só você enviar uma mensagem que começa com 'pergunta:' \n\n*Exemplos:*\npergunta: Porque o meu crush parou de falar comigo?\npergunta: No que preciso prestar atenção nessa semana?\npergunta: Como vai ser o meu mês de outubro?\n\nDepois de enviar a sua pergunta corretamente, o Zoltar vai separa três cartas e relacionar o que saiu com a sua pergunta.\n\n*AVISO IMPORTANTE [1]:*\nVocê tem o direito de consultar o Zoltar apenas uma vez por dia. \n\nPortanto, pense cuidadosamente na pergunta que deseja fazer.\n\n*AVISO IMPORTANTE [2]:*\nSua perguntas são 100% privadas e não são armazenadas em nosso banco de dados.");
            SendMessageWhatsApp(whatsappMessageStatus);
        }

       



    res.send("EVENT_RECEIVED");
  } catch (e) {
    res.send("EVENT_RECEIVED");
  }
};

async function sendChatGPTResponse(userText, tarotCardsArray, number, maxAttempts = 3) {
    let attempt = 0;
    let errorOccurred;

<<<<<<< HEAD
    while (attempt < maxAttempts) {
        try {
            const OpenAIText = await createThreadOpenAI(userText, tarotCardsArray);
            separateTextAndSend(OpenAIText, number);
            errorOccurred = false;
            break; // Se for bem-sucedido, sai do loop
        } catch (error) {
            errorOccurred = true;
            console.log(`Tentativa ${attempt + 1} falhou:`, error);
            attempt++;
        }
    }
    if (errorOccurred) {
        if (attempt >= maxAttempts) {
            const whatsappMessageStatus = samples.SampleText(number, "Infelizmente, os servidores estão sobrecarregados e não conseguimos consultar o Zoltar. Por favor, tente novamente mais tarde. Lembre-se, você ainda tem direito à sua pergunta do dia.");
            SendMessageWhatsApp(whatsappMessageStatus);
        } else {
            const whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde mais alguns minutos.");
            SendMessageWhatsApp(whatsappMessageStatus);
        } 
=======
    
      separateTextAndSend(OpenAIText, number);
      sendEvaluation(number);

    } catch (error) {
      console.log(error);
      const whatsappMessageStatus = samples.SampleText(number, "Ocorreu um erro ao consultar o Zoltar. Por favor, tente novamente.");
      SendMessageWhatsApp(whatsappMessageStatus);
>>>>>>> evaluation
    }
}

// async function sendChatGPTResponse(userText, tarotCardsArray, number) {
//     try {
//       const OpenAIText = await createThreadOpenAI(userText, tarotCardsArray);

    
//       separateTextAndSend(OpenAIText, number);


//     } catch (error) {
//       console.log(error);
//       const whatsappMessageStatus = samples.SampleText(number, "Ocorreu um erro ao consultar o Zoltar. Por favor, tente novamente.");
//       SendMessageWhatsApp(whatsappMessageStatus);
//     }
// }

function separateTextAndSend(text, number) { 
    const frase = "Zoltar fecha os olhos e, após um breve silêncio, começa a falar:";
    const partes = text.split(frase);
    let whatsappMessageStatus;

    // Verifica se a frase existe no texto
    if (partes.length > 1) {
        whatsappMessageStatus = samples.SampleText(number, partes[0] + frase);
        SendMessageWhatsApp(whatsappMessageStatus);
        sendTextToSpeechResponse(partes[1], number);
    } else {
        whatsappMessageStatus = samples.SampleText(number, text);
        SendMessageWhatsApp(whatsappMessageStatus);
    }
}

async function sendTextToSpeechResponse(OpenAIText, number) {
    try {
        const audioUrl = await textToSpeech(OpenAIText);
        const audioMessage = samples.SampleAudio(number, audioUrl);
        SendMessageWhatsApp(audioMessage);
    } catch (error) {
        console.log(error);
    }
}

async function sendEvaluation(number) {
    try {
        let whatsappMessageStatus = samples.SampleEvaluation(
            number,
            "Dê uma nota de 1 a 5 para o Zoltar"
        );
        SendMessageWhatsApp(whatsappMessageStatus);
    } catch (error) {
        console.error("Error sending evaluation message:", error);
    }
}

module.exports = {
  VerifyToken,
  ReceivedMessage,
};
