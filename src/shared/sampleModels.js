function SampleText(textResponse, number){
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        text: {
          body: textResponse,
        },
        type: "text",
      });
      return data
};

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
};

module.exports = {
  SampleText,
  SampleImage
}