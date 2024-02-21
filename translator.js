const {translateAndGenerateSSML} = require('./divider');
const {transcribeVideo} = require('./transcript2');
const {generateAudioFromSSML} = require('./speechGenerator');
const fs = require('fs');

async function main(){
    const targetLanguage = 'ru';
    const audioFilePath = 'd:/Загрузки/videoplayback.mp4'
    const timestamps = await transcribeVideo(audioFilePath);
    const ssmls = await translateAndGenerateSSML(timestamps,targetLanguage);
    const concatenatedAudio = await generateAudioFromSSML(ssmls);
    fs.writeFileSync('d:/Загрузки/videoplaybackTranslated.mp3', concatenatedAudio);
}
main().catch(console.error);