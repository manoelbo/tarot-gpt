const { SendMessageWhatsApp } = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../services/tarotServices");
const { createThreadOpenAI } = require("../services/openaiServices");
const { textToSpeech } = require("../services/textToSpeechServices");

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


const ReceivedMessage = (req, res) => {
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

        

        let whatsappMessageCardImage;
        let whatsappMessageCardName;
        let whatsappMessageStatus;

        if (userText.startsWith("pergunta:")) {
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
                }, 5000 * (index + 1));
                
            });

            setTimeout(() => {
                whatsappMessageStatus = samples.SampleText(number, "Zoltar está pensando... Aguarde alguns minutos.");
                SendMessageWhatsApp(whatsappMessageStatus);
            }, 20000);

        } else {
            // whatsappMessageStatus = samples.SampleText(number,  "Olá,\n\nSeja bem-vindo(a) ao *Zoltar Tarot IA*.\nSomos uma maneira acessível de você consultar a sabedoria do ```Tarot```.\n\n*Como funciona?:*\nPara fazer um consultar, é só você enviar uma mensagem que começa com 'pergunta:' \n\n*Exemplos:*\npergunta: Porque o meu crush parou de falar comigo?\npergunta: No que preciso prestar atenção nessa semana?\npergunta: Como vai ser o meu mês de outubro?\n\nDepois de enviar a sua pergunta corretamente, o Zoltar vai separa três cartas e relacionar o que saiu com a sua pergunta.\n\n*Aviso importante:* você tem o direito de consultar o Zoltar apenas uma vez por dia. Portanto, pense cuidadosamente na pergunta que deseja fazer.");
            // SendMessageWhatsApp(whatsappMessageStatus);
        }

       



    res.send("EVENT_RECEIVED");
  } catch (e) {
    res.send("EVENT_RECEIVED");
  }
};

async function sendChatGPTResponse(userText, tarotCardsArray, number) {
    try {
      const OpenAIText = await createThreadOpenAI(userText, tarotCardsArray);
    //   const whatsappMessageStatus = samples.SampleText(number, OpenAIText);
    //   SendMessageWhatsApp(whatsappMessageStatus);
      sendTextToSpeechResponse(OpenAIText, number);

    } catch (error) {
      console.log(error);
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

module.exports = {
  VerifyToken,
  ReceivedMessage,
};
