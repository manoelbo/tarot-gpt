function SampleText(number, text){
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        text: {
          body: text,
        },
        type: "text",
      });
      return data
}

function SampleImage(number, path){
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        type: "image",
        image: {
          link: path, 
        },
      });
      return data
}

function SampleAudio(number, path){
  const data = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": number,
      "type": "audio",  
      "audio": {
          "link": path
      }        
  });
  return data;
}

module.exports = {
  SampleText,
  SampleImage,
  SampleAudio
}