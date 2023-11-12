const https = require("https");

function SendMessageWhatsApp(textResponse, number){
    const Authorization = "Bearer " + process.env.META_TOKEN;
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "text": {
            "body": textResponse
        },
        "type": "text"
    });

    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/114767571657569/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization
        }
    };

    const req = https.request(options, res => {
        res.on("data" , d=> {
            process.stdout.write(d);
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.write(data);
    req.end();

}

module.exports = {
    SendMessageWhatsApp
}