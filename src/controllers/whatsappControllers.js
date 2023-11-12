
const VerfiToken = (req, res) => {
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
}


const ReceivedMessage = (req, res) => {
    try{
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = (changes["value"]);
        var messageObject = value["messages"];
       
        var text = "Olá,\n\nSeja bem-vindo ao *Anti Audio Audio Club*. Somos um serviço e uma comunidade ```PREMIUM``` para pessoas que odeiam receber áudios no WhatsApp.\n\n*Como essa budega funciona:*\nSempre que você encaminhar ou enviar um áudio para este contato, nós o transcreveremos para você. Simples assim. \n\nNosso serviço está na fase beta do beta. Não confie na transcrição e não nos xingue.\n\nEstamos trabalhando duro para um mundo com menos áudios do WhatsApp.\n\n#vitórianaguerra"
                
        whatsappService.SendMessageWhatsApp(text, number);
        res.send("EVENT_RECEIVED");
        
    }catch(e){
        res.send("EVENT_RECEIVED");
    }
}

module.exports = {
    VerfiToken,
    ReceivedMessage
}