const textToSpeech = require('@google-cloud/text-to-speech');


// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const TTSpeech = `{
    "Afrikaans(South Africa)F": {
        "languageCode": "af-ZA",
        "name": "af-ZA-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "ArabicF": {
        "languageCode": "ar-XA",
        "name": "ar-XA-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "ArabicM": {
        "languageCode": "ar-XA",
        "name": "ar-XA-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Basque(Spain)F": {
        "languageCode": "eu-ES",
        "name": "eu-ES-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Bengali(India)F": {
        "languageCode": "bn-IN",
        "name": "bn-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Bengali(India)M": {
        "languageCode": "bn-IN",
        "name": "bn-IN-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Bulgarian(Bulgaria)F": {
        "languageCode": "bg-BG",
        "name": "bg-BG-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Catalan(Spain)F": {
        "languageCode": "ca-ES",
        "name": "ca-ES-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Czech(Czech Republic)F": {
        "languageCode": "cs-CZ",
        "name": "cs-CZ-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Danish(Denmark)F": {
        "languageCode": "da-DK",
        "name": "da-DK-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "Danish(Denmark)M": {
        "languageCode": "da-DK",
        "name": "da-DK-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Dutch(Belgium)F": {
        "languageCode": "nl-BE",
        "name": "nl-BE-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Dutch(Belgium)M": {
        "languageCode": "nl-BE",
        "name": "nl-BE-Wavenet-B",
        "ssmlGender": "MALE"
    },
    "Dutch(Netherlands)F": {
        "languageCode": "nl-NL",
        "name": "nl-NL-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "Dutch(Netherlands)M": {
        "languageCode": "nl-NL",
        "name": "nl-NL-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "English(Australia)F": {
        "languageCode": "en-AU",
        "name": "en-AU-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "English(Australia)M": {
        "languageCode": "en-AU",
        "name": "en-AU-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "English(India)F": {
        "languageCode": "en-IN",
        "name": "en-IN-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "English(India)M": {
        "languageCode": "en-IN",
        "name": "en-IN-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "English(UK)F": {
        "languageCode": "en-GB",
        "name": "en-GB-Wavenet-F",
        "ssmlGender": "FEMALE"
    },
    "English(UK)M": {
        "languageCode": "en-GB",
        "name": "en-GB-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "English(US)F": {
        "languageCode": "en-US",
        "name": "en-US-Wavenet-H",
        "ssmlGender": "FEMALE"
    },
    "English(US)M": {
        "languageCode": "en-US",
        "name": "en-US-Wavenet-J",
        "ssmlGender": "MALE"
    },
    "Finnish(Finland)F": {
        "languageCode": "fi-FI",
        "name": "fi-FI-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "French(Canada)F": {
        "languageCode": "fr-CA",
        "name": "fr-CA-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "French(Canada)M": {
        "languageCode": "fr-CA",
        "name": "fr-CA-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "French(France)F": {
        "languageCode": "fr-FR",
        "name": "fr-FR-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "French(France)M": {
        "languageCode": "fr-FR",
        "name": "fr-FR-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Galician(Spain)F": {
        "languageCode": "gl-ES",
        "name": "gl-ES-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "German(Germany)F": {
        "languageCode": "de-DE",
        "name": "de-DE-Wavenet-F",
        "ssmlGender": "FEMALE"
    },
    "German(Germany)M": {
        "languageCode": "de-DE",
        "name": "de-DE-Wavenet-E",
        "ssmlGender": "MALE"
    },
    "Greek(Greece)F": {
        "languageCode": "el-GR",
        "name": "el-GR-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Gujarati(India)F": {
        "languageCode": "gu-IN",
        "name": "gu-IN-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Gujarati(India)M": {
        "languageCode": "gu-IN",
        "name": "gu-IN-Wavenet-B",
        "ssmlGender": "MALE"
    },
    "Hebrew(Israel)F": {
        "languageCode": "he-IL",
        "name": "he-IL-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Hebrew(Israel)M": {
        "languageCode": "he-IL",
        "name": "he-IL-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Hindi(India)F": {
        "languageCode": "hi-IN",
        "name": "hi-IN-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "Hindi(India)M": {
        "languageCode": "hi-IN",
        "name": "hi-IN-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Hungarian(Hungary)F": {
        "languageCode": "hu-HU",
        "name": "hu-HU-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Icelandic(Iceland)F": {
        "languageCode": "is-IS",
        "name": "is-IS-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Indonesian(Indonesia)F": {
        "languageCode": "id-ID",
        "name": "id-ID-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "Indonesian(Indonesia)M": {
        "languageCode": "id-ID",
        "name": "id-ID-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Italian(Italy)F": {
        "languageCode": "it-IT",
        "name": "it-IT-Wavenet-B",
        "ssmlGender": "FEMALE"
    },
    "Italian(Italy)M": {
        "languageCode": "it-IT",
        "name": "it-IT-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Japanese(Japan)F": {
        "languageCode": "ja-JP",
        "name": "ja-JP-Wavenet-B",
        "ssmlGender": "FEMALE"
    },
    "Japanese(Japan)M": {
        "languageCode": "ja-JP",
        "name": "ja-JP-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Kannada(India)F": {
        "languageCode": "kn-IN",
        "name": "kn-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Kannada(India)M": {
        "languageCode": "kn-IN",
        "name": "kn-IN-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Korean(South Korea)F": {
        "languageCode": "ko-KR",
        "name": "ko-KR-Wavenet-B",
        "ssmlGender": "FEMALE"
    },
    "Korean(South Korea)M": {
        "languageCode": "ko-KR",
        "name": "ko-KR-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Latvian(Latvia)M": {
        "languageCode": "lv-LV",
        "name": "lv-LV-Standard-A",
        "ssmlGender": "MALE"
    },
    "Lithuanian(Lithuania)M": {
        "languageCode": "lt-LT",
        "name": "lt-LT-Standard-A",
        "ssmlGender": "MALE"
    },
    "Malay(Malaysia)F": {
        "languageCode": "ms-MY",
        "name": "ms-MY-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Malay(Malaysia)M": {
        "languageCode": "ms-MY",
        "name": "ms-MY-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Malayalam(India)F": {
        "languageCode": "ml-IN",
        "name": "ml-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Malayalam(India)M": {
        "languageCode": "ml-IN",
        "name": "ml-IN-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Marathi(India)F": {
        "languageCode": "mr-IN",
        "name": "mr-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Marathi(India)M": {
        "languageCode": "mr-IN",
        "name": "mr-IN-Wavenet-B",
        "ssmlGender": "MALE"
    },
    "Norwegian(Norway)F": {
        "languageCode": "nb-NO",
        "name": "nb-NO-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "Norwegian(Norway)M": {
        "languageCode": "nb-NO",
        "name": "nb-NO-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Polish(Poland)F": {
        "languageCode": "pl-PL",
        "name": "pl-PL-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "Polish(Poland)M": {
        "languageCode": "pl-PL",
        "name": "pl-PL-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Punjabi(India)F": {
        "languageCode": "pa-IN",
        "name": "pa-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Punjabi(India)M": {
        "languageCode": "pa-IN",
        "name": "pa-IN-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Romanian(Romania)F": {
        "languageCode": "ro-RO",
        "name": "ro-RO-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Russian(Russia)F": {
        "languageCode": "ru-RU",
        "name": "ru-RU-Wavenet-E",
        "ssmlGender": "FEMALE"
    },
    "Russian(Russia)M": {
        "languageCode": "ru-RU",
        "name": "ru-RU-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Serbian(Cyrillic)F": {
        "languageCode": "sr-RS",
        "name": "sr-RS-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Slovak(Slovakia)F": {
        "languageCode": "sk-SK",
        "name": "sk-SK-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Spanish(Spain)F": {
        "languageCode": "es-ES",
        "name": "es-ES-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "Spanish(Spain)M": {
        "languageCode": "es-ES",
        "name": "es-ES-Wavenet-B",
        "ssmlGender": "MALE"
    },
    "Spanish(US)F": {
        "languageCode": "es-US",
        "name": "es-US-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Spanish(US)M": {
        "languageCode": "es-US",
        "name": "es-US-Wavenet-C",
        "ssmlGender": "MALE"
    },
    "Swedish(Sweden)F": {
        "languageCode": "sv-SE",
        "name": "sv-SE-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "Swedish(Sweden)M": {
        "languageCode": "sv-SE",
        "name": "sv-SE-Wavenet-E",
        "ssmlGender": "MALE"
    },
    "Tamil(India)F": {
        "languageCode": "ta-IN",
        "name": "ta-IN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Tamil(India)M": {
        "languageCode": "ta-IN",
        "name": "ta-IN-Wavenet-D",
        "ssmlGender": "MALE"
    },
    "Telugu(India)F": {
        "languageCode": "te-IN",
        "name": "te-IN-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Telugu(India)M": {
        "languageCode": "te-IN",
        "name": "te-IN-Standard-B",
        "ssmlGender": "MALE"
    },
    "Thai(Thailand)F": {
        "languageCode": "th-TH",
        "name": "th-TH-Standard-A",
        "ssmlGender": "FEMALE"
    },
    "Turkish(Turkey)F": {
        "languageCode": "tr-TR",
        "name": "tr-TR-Wavenet-D",
        "ssmlGender": "FEMALE"
    },
    "Turkish(Turkey)M": {
        "languageCode": "tr-TR",
        "name": "tr-TR-Wavenet-E",
        "ssmlGender": "MALE"
    },
    "Ukrainian(Ukraine)F": {
        "languageCode": "uk-UA",
        "name": "uk-UA-Wavenet-A",
        "ssmlGender": "FEMALE"
    },
    "Vietnamese(Vietnam)F": {
        "languageCode": "vi-VN",
        "name": "vi-VN-Wavenet-C",
        "ssmlGender": "FEMALE"
    },
    "Vietnamese(Vietnam)M": {
        "languageCode": "vi-VN",
        "name": "vi-VN-Wavenet-D",
        "ssmlGender": "MALE"
    }
}`
const voices = JSON.parse(TTSpeech)
async function generateAudioFromSSML(ssmls,targetLanguage) {
    let concatenatedAudio = Buffer.from([]);
    let voice = voices[targetLanguage]
    for (const { ssml } of ssmls) {
        const request = {
            input: { ssml },
            voice: voice,
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await client.synthesizeSpeech(request);
        concatenatedAudio = Buffer.concat([concatenatedAudio, response.audioContent]);
    }
    console.log('Concatenated audio file generated successfully.');
    return concatenatedAudio;
}
module.exports = {generateAudioFromSSML,voices};
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