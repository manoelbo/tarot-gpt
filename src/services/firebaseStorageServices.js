const { getStorage } = require('firebase-admin/storage');

// Função para upload de arquivo
async function uploadAudioToStorage(localFilePath) {
  const bucket = getStorage().bucket('tarotgpt-a1289.appspot.com');

  const uniqueFileName = `audio/audio_${new Date().getTime()}.ogg`;
  await bucket.upload(localFilePath, {
    destination: uniqueFileName,
  });

  // Tornar o arquivo público
  await bucket.file(uniqueFileName).makePublic();

  // Retornar a URL pública
  return `https://storage.googleapis.com/tarotgpt-a1289.appspot.com/${uniqueFileName}`;
}

module.exports = {
  uploadAudioToStorage,
};