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

function SampleEvaluation(number, text) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": text,
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
              "id": "5_stars",
              "title": "5 ⭐⭐⭐⭐⭐"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "4_stars",
              "title": "4 ⭐⭐⭐⭐"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "3_stars",
              "title": "3 ⭐⭐⭐"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "2_stars",
              "title": "2 ⭐⭐"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "1_star",
              "title": "1 ⭐"
            }
          },
        ]
      }
    }
  });

  return data;
}

module.exports = {
  SampleText,
  SampleImage,
  SampleAudio,
  SampleEvaluation,
}