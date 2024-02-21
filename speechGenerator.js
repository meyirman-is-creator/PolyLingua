const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function generateAudioFromSSML(ssmls) {
    let concatenatedAudio = Buffer.from([]);

    for (const { ssml } of ssmls) {
        const request = {
            input: { ssml },
            voice: { languageCode: 'ru-RU', ssmlGender: 'MALE'},
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await client.synthesizeSpeech(request);
        concatenatedAudio = Buffer.concat([concatenatedAudio, response.audioContent]);
    }
    console.log('Concatenated audio file generated successfully.');
    return concatenatedAudio;
}
module.exports = {generateAudioFromSSML};
// async function main() {
//     const ssmls = [
//         {
//             ssml: '<speak><break time="1.1s"/>так что, я сейчас о чем-то говорю</speak>'
//         },
//         {
//             ssml: '<speak><break time="8.2s"/>найдите подходящие аудио- или видеофайлы для тестирования вашего кода с помощью Google Cloud</speak>'
//         },
//         {
//             ssml: '<speak><break time="1s"/>речь в текст API</speak>'
//         },
//         {
//             ssml: '<speak><break time="9.2s"/>у вас есть несколько вариантов</speak>'
//         }
//     ];

//     const concatenatedAudio = await generateAudioFromSSML(ssmls);

//     // Save the concatenated audio file
//     fs.writeFileSync('output.mp3', concatenatedAudio);

//     console.log('Concatenated audio file generated successfully.');
// }

// main().catch(console.error);