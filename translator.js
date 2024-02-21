import { transcribeVideo } from './transcript2';
import { translateAndGenerateSSML } from './divider';
import { generateAudioFromSSML } from './speechGenerator';
// const fs = require('fs');

async function main(audioFilePath,targetLanguage,sourceLanguage){
    // const targetLanguage = 'en';
    // const audioFilePath = 'gs://polylingua-videos/Не_хватает_денег_как_накопить_финансовую_подушку_.mp4'
    console.log('Main running');
    const timestamps = await transcribeVideo(audioFilePath,sourceLanguage);
    const ssmls = await translateAndGenerateSSML(timestamps,targetLanguage);
    const concatenatedAudio = await generateAudioFromSSML(ssmls,targetLanguage);

    const concatenatedAudioBlob = new Blob([concatenatedAudio], { type: 'audio/mp3' });
    const audioBlobUrl = URL.createObjectURL(concatenatedAudioBlob);
    
    const audioElement = document.getElementById('audioPlayer');
    audioElement.src = audioBlobUrl;

}

// let optionFrom = "English(United States)"
// let optionTo = "Russian(Russia)M"
// bt = document.getElementById("translate")
// bt.addEventListener('click', function() {
//     // main(audioFilePath, targetLanguage, sourceLanguage);
//     console.log('Loaded');
//     main('gs://polylingua-videos/msg704415982-196038.mp3',optionTo,optionFrom).catch(console.error);
// });

function onYouTubeIframeAPIReady() {
    console.log('YouTube API ready');
    // const bt = document.getElementById("translate");
    
    
}
const from = document.getElementById("sourceLanguage") ;
const to = document.getElementById("targetLanguage");
const optionFrom = from.value ;
const optionTo = to.value;
console.log(optionFrom);
console.log(optionTo);
const bt = document.getElementById("translate") 
bt.addEventListener("focus",async function (){
    console.log('Translate button clicked');
    try {
        await main('gs://polylingua-videos/msg704415982-196038.mp3', optionTo, optionFrom);
    } catch (error) {
        console.error(error);
    }
});
