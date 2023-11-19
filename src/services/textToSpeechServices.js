const https = require("https");
const fs = require('fs');
const path = require('path');
const { uploadAudioToStorage } = require("./firebaseStorageServices");

function textToSpeech(text) {
  console.log(text)
  return new Promise((resolve, reject) => {
    var options = {
      'method': 'POST',
      'hostname': 'brazilsouth.tts.speech.microsoft.com',
      'path': '/cognitiveservices/v1',
      'headers': {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'ogg-24khz-16bit-mono-opus',
        'User-Agent': 'curl'
      },
      'maxRedirects': 20
    };
    
    var req = https.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      // eslint-disable-next-line no-unused-vars
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        const fileName = path.join(__dirname, '..', '..', 'public', 'audio', 'tmp', `audio_${new Date().getTime()}.ogg`);
        fs.writeFile(fileName, body, 'binary', function(err){
          if(err) {
            reject(err);
          } else {
            console.log('File saved successfully!');
            uploadAudioToStorage(fileName)
              .then(url => resolve(url))
              .catch(err => reject(err));
          }

      });
      });
      res.on("error", function (error) {
        console.error(error);
      });
    });

    const postData =  "<speak version='1.0' xml:lang='en-US'>\n    <voice xml:lang='pt-BR' xml:gender='male' name='pt-BR-AntonioNeural'>\n"+text+"</voice>\n</speak>";
    
    req.write(postData);
    
    req.end();
  });

}

module.exports = {
    textToSpeech
}
