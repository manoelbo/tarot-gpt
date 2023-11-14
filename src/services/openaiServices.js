// requere openai module
const openAI = require('openai');
const dotenv = require('dotenv');
const samples = require('../shared/sampleModels');
const { SendMessageWhatsApp } = require('./whatsappServices');
dotenv.config()

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createThreadOpenAI(question, cards, phone_number) {
  console.log("🚀 ~ file: openaiServices.js:15 ~ createThreadOpenAI ~ createThreadOpenAI:", createThreadOpenAI)
  // create let content with text pergunta: {question} + break line + carta 1: {card[0]} + break line + carta 2: {card[1]} + break line + carta 3: {card[3]} 
  let content = `pergunta: ${question}\n`;
  cards.forEach((card, index) => {
    content += `carta ${index + 1}: ${card.name}\n`;
  });
  console.log("🚀 ~ file: openaiServices.js:19 ~ createThreadOpenAI ~ content:", content)

  const userThread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
  });
  // get Thread Object ID if userThread is not null or undefined else return error 
  runThreadWithAssistent(userThread, phone_number);
}

async function runThreadWithAssistent(userThread, phone_number) {
  const runThread = await openai.beta.threads.runs.create(
    userThread.id,
    { assistant_id: "asst_f1mkXd0SJfwlW3oJKDjE0P4H" }
  );
  waitRunToComplete(userThread, runThread, phone_number);
}

async function waitRunToComplete(userThread, runThread, phone_number){
  let run = runThread;
  while (run.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    run = await openai.beta.threads.runs.retrieve(userThread.id , run.id);
  }
  if (run.status === "completed") {
    getMessageCreatedByRunOnThread(userThread, run, phone_number);
  }
}

async function getMessageCreatedByRunOnThread(userThread, completedRun, phone_number){
  
  const messages = await openai.beta.threads.messages.list(userThread.id);
  const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === completedRun.id && message.role === "assistant"
        )
        .pop();
    
      let whatsappMessage = "";
      if (lastMessageForRun) {
        whatsappMessage = samples.SampleText(phone_number, lastMessageForRun.content[0].text.value);
        SendMessageWhatsApp(whatsappMessage);
      }
}


module.exports = {
  createThreadOpenAI,
}; 
  
