// requere openai module
const openAI = require('openai');
const dotenv = require('dotenv');
dotenv.config()

const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createThreadOpenAI(question, cards) {
  try {
    // console.log("🚀 ~ file: openaiServices.js:15 ~ createThreadOpenAI ~ createThreadOpenAI:", createThreadOpenAI)
    let content = `${question}\n\n`;
    const cardA = cards[0].name;
    const cardB = cards[1].name;
    const cardC = cards[2].name;
    
    content += `carta A: ${cardA}\n`;
    content += `carta B: ${cardB}\n`;
    content += `carta C: ${cardC}\n`;
    content += `\n`;
    content += ` Siga exatamente o modelo abaixo para o roteiro:
    
    Zoltar abre seus olhos e direciona sua cabeça para a primeira carta. 
    [Inserir o nome da carta ${cardA} aqui] 
    [Inserir a descrição da carta ${cardA} e como ela pode estar relacionada à pergunta]

    Zoltar então foca sua atenção na segunda carta. 
    [Inserir o nome da carta ${cardB} aqui] 
    [Inserir a descrição da carta ${cardB} e como ela pode estar relacionada à pergunta]

    Agora, o tarólogo mecânico examina a terceira carta com um olhar profundo. 
    [Inserir o nome da carta ${cardC} aqui] 
    [Inserir a descrição da carta ${cardC} e como ela pode estar relacionada à pergunta] 

    Zoltar fecha os olhos e, após um breve silêncio, começa a falar: 
    [Inserir a narrativa que reponde minha pergunta de maneira poética e reflexiva]`;
  

    // console.log("🚀 ~ file: openaiServices.js:15 ~ createThreadOpenAI ~ content:", content);
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
  // console.log("🚀 ~ file: openaiServices.js:35 ~ runThreadWithAssistent ~ runThreadWithAssistent:", runThreadWithAssistent)
  let maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const runThread = await openai.beta.threads.runs.create(
        userThread.id,
        { assistant_id: "asst_WX5qJ9n0C1ViFQGpdyZ7DqOa" }
      );
      return waitRunToComplete(userThread, runThread);
    } catch (error) {
      console.error(`Tentativa ${attempt} falhou:`, error);
      if (attempt === maxAttempts) {
        throw new Error('Todas as tentativas de executar a thread com assistente falharam');
      }
    }
  }
}

async function waitRunToComplete(userThread, runThread) {
  // console.log("🚀 ~ file: openaiServices.js:50 ~ waitRunToComplete ~ waitRunToComplete:", waitRunToComplete)

  
  let run = runThread;
  while (run.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(run.status);
    run = await openai.beta.threads.runs.retrieve(userThread.id , run.id);
    if (run.status === "failed") {
      console.log(run.last_error.message);
      throw new Error('A execução de run falhou');
    }
  }
  if (run.status === "completed") {
    console.log(run.status);
    return getMessageCreatedByRunOnThread(userThread, run);
  }
}

async function getMessageCreatedByRunOnThread(userThread, completedRun){
  
  try {
    // console.log("🚀 ~ file: openaiServices.js:67 ~ getMessageCreatedByRunOnThread ~ getMessageCreatedByRunOnThread:", getMessageCreatedByRunOnThread)
    const messages = await openai.beta.threads.messages.list(userThread.id);
    
    // const lastMessageForRun = messages.data
    //       .filter(
    //         (message) => message.run_id === completedRun.id && message.role === "assistant"
    //       )
    //       .pop();
    const lastMessageForRun = messages.data[0];
    console.log("🚀 ~ file: openaiServices.js:67 ~ getMessageCreatedByRunOnThread ~ lastMessageForRun:", lastMessageForRun)
    if (lastMessageForRun && lastMessageForRun.role === "assistant") {
      var regex = /\d+†fonte/g;
      const cleanedText = lastMessageForRun.content[0].text.value.replace('tarot','tarô').replace('crush', 'crâaxhi').replace(regex, '').replace('【', '').replace('】', '').replace('\u3010', '').replace('\u3011', '');
      return cleanedText;
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
  
