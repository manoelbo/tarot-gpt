// requere openai module
const openAI = require('openai');
const dotenv = require('dotenv');
dotenv.config()

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createThreadOpenAI(question, cards) {
  try {
    console.log("🚀 ~ file: openaiServices.js:15 ~ createThreadOpenAI ~ createThreadOpenAI:", createThreadOpenAI)
    let content = `${question}\n`;
    cards.forEach((card, index) => {
      
      content += `carta ${index + 1}: ${card.name}\n`;
    });

    console.log("🚀 ~ file: openaiServices.js:15 ~ createThreadOpenAI ~ content:", content);
    const userThread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    return runThreadWithAssistent(userThread);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar thread com a OpenAI');
  }
}

async function runThreadWithAssistent(userThread) {
  console.log("🚀 ~ file: openaiServices.js:35 ~ runThreadWithAssistent ~ runThreadWithAssistent:", runThreadWithAssistent)
  try {
    
    const runThread = await openai.beta.threads.runs.create(
      userThread.id,
      { assistant_id: "asst_f1mkXd0SJfwlW3oJKDjE0P4H" }
    );
    return waitRunToComplete(userThread, runThread);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao executar thread com assistente');
  }
}

async function waitRunToComplete(userThread, runThread) {
  console.log("🚀 ~ file: openaiServices.js:50 ~ waitRunToComplete ~ waitRunToComplete:", waitRunToComplete)
  let run = runThread;
  while (run.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(run.status);
    run = await openai.beta.threads.runs.retrieve(userThread.id , run.id);
    if (run.status === "failed") {
      console.log(run.last_error.message);
      throw new Error('A execução de run falhou');
    }
  }
  if (run.status === "completed") {
    return getMessageCreatedByRunOnThread(userThread, run);
  }
}

async function getMessageCreatedByRunOnThread(userThread, completedRun){
  
  try {
    console.log("🚀 ~ file: openaiServices.js:67 ~ getMessageCreatedByRunOnThread ~ getMessageCreatedByRunOnThread:", getMessageCreatedByRunOnThread)
    const messages = await openai.beta.threads.messages.list(userThread.id);
    const lastMessageForRun = messages.data
          .filter(
            (message) => message.run_id === completedRun.id && message.role === "assistant"
          )
          .pop();
    if (lastMessageForRun) {
      return lastMessageForRun.content[0].text.value;
    } else {
      throw new Error('Nenhuma mensagem encontrada para a execução concluída');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter a mensagem criada pela execução');
  }
}


module.exports = {
  createThreadOpenAI,
}; 
  
