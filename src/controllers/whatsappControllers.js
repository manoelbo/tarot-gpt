const whatsappService = require("../services/whatsappServices");
const samples = require("../shared/sampleModels");
const drawTarotCards = require("../services/tarotServices");

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
