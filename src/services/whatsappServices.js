const https = require("https");

function SendMessageWhatsApp(data){
    console.log("SendMessageWhatsApp");
    const Authorization = "Bearer " + process.env.META_TOKEN;
    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/178863411971086/messages",
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