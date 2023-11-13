const whatsappService = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../cards/shuffleCards");

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
    console.log("ReceivedMessage");
    try {
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = (changes["value"]);
        var messageObject = value["messages"];
        var messages = messageObject[0];
        var number = messages["from"];

        console.log('messages:',messages);
       
        var text = "Olá mundo! assinado: Zoltar Tarot IA";

        const tarotReading = drawTarotCards();
        const tarotCardsArray = Object.values(tarotReading);

        let data;

        if (text === "leitura") {
            tarotCardsArray.forEach(card => {
                data = samples.SampleImage(number, card.image);
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
