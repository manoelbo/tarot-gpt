const whatsappService = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../services/tarotServices");

const VerifyToken = (req, res) => {
    try {
        var accessToken = process.env.META_TOKEN;
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];

        if(challenge != null && token != null && token == accessToken) {
            res.send(challenge);
        } else {
            res. status(400).send();
        }
    }catch(e){
        myConsole.log(e);
        res. status(400).send();
    }
};


const ReceivedMessage = (req, res) => {
    try {

        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = (changes["value"]);
        var messageObject = value["messages"];
        var messages = messageObject[0];
        var number = messages["from"];
        var userText = messages.text.body;

        
       
        var text = "Olá mundo! assinado: Zoltar Tarot IA";

        const tarotReading = drawTarotCards();
        const tarotCardsArray = Object.values(tarotReading);

    
        console.log(tarotCardsArray);

        let data; 


        if (userText === "leitura") {
            tarotCardsArray.forEach(card => {
                data = samples.SampleImage(number, card.image);
                // data = samples.SampleText(number, card.name);
                console.log(data);
                whatsappService.SendMessageWhatsApp(data);
            })
        }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    res.send("EVENT_RECEIVED");
  }
};

module.exports = {
  VerifyToken,
  ReceivedMessage,
};
