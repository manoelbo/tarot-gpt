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

function SampleEvaluation(number, readingRef) {
  const feedback_yes = `feedback_yes_${readingRef}`;
  const feedback_no = `feedback_no_${readingRef}`;
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": "Você gostou da sua experiência com o Zoltar?",
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
              "id": feedback_yes,
              "title": "Sim 👍"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": feedback_no,
              "title": "Não 👎"
            }
          }
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