const { Storage } = require('@google-cloud/storage');
const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;


const STText = `{
    "Afrikaans(South Africa)": {
        "languageCode": "af-ZA"
    },
    "Albanian(Albania)": {
        "languageCode": "sq-AL"
    },
    "Amharic(Ethiopia)": {
        "languageCode": "am-ET"
    },
    "Arabic(Algeria)": {
        "languageCode": "ar-DZ"
    },
    "Arabic(Bahrain)": {
        "languageCode": "ar-BH"
    },
    "Arabic(Egypt)": {
        "languageCode": "ar-EG"
    },
    "Arabic(Iraq)": {
        "languageCode": "ar-IQ"
    },
    "Arabic(Israel)": {
        "languageCode": "ar-IL"
    },
    "Arabic(Jordan)": {
        "languageCode": "ar-JO"
    },
    "Arabic(Kuwait)": {
        "languageCode": "ar-KW"
    },
    "Arabic(Lebanon)": {
        "languageCode": "ar-LB"
    },
    "Arabic(Mauritania)": {
        "languageCode": "ar-MR"
    },
    "Arabic(Morocco)": {
        "languageCode": "ar-MA"
    },
    "Arabic(Oman)": {
        "languageCode": "ar-OM"
    },
    "Arabic(Qatar)": {
        "languageCode": "ar-QA"
    },
    "Arabic(Saudi Arabia)": {
        "languageCode": "ar-SA"
    },
    "Arabic(State of Palestine)": {
        "languageCode": "ar-PS"
    },
    "Arabic(Syria)": {
        "languageCode": "ar-SY"
    },
    "Arabic(Tunisia)": {
        "languageCode": "ar-TN"
    },
    "Arabic(United Arab Emirates)": {
        "languageCode": "ar-AE"
    },
    "Arabic(Yemen)": {
        "languageCode": "ar-YE"
    },
    "Armenian(Armenia)": {
        "languageCode": "hy-AM"
    },
    "Azerbaijani(Azerbaijan)": {
        "languageCode": "az-AZ"
    },
    "Basque(Spain)": {
        "languageCode": "eu-ES"
    },
    "Bengali(Bangladesh)": {
        "languageCode": "bn-BD"
    },
    "Bengali(India)": {
        "languageCode": "bn-IN"
    },
    "Bosnian(Bosnia and Herzegovina)": {
        "languageCode": "bs-BA"
    },
    "Bulgarian(Bulgaria)": {
        "languageCode": "bg-BG"
    },
    "Catalan(Spain)": {
        "languageCode": "ca-ES"
    },
    "Croatian(Croatia)": {
        "languageCode": "hr-HR"
    },
    "Czech(Czech Republic)": {
        "languageCode": "cs-CZ"
    },
    "Danish(Denmark)": {
        "languageCode": "da-DK"
    },
    "Dutch(Belgium)": {
        "languageCode": "nl-BE"
    },
    "Dutch(Netherlands)": {
        "languageCode": "nl-NL"
    },
    "English(Australia)": {
        "languageCode": "en-AU"
    },
    "English(Canada)": {
        "languageCode": "en-CA"
    },
    "English(Ghana)": {
        "languageCode": "en-GH"
    },
    "English(Hong Kong)": {
        "languageCode": "en-HK"
    },
    "English(India)": {
        "languageCode": "en-IN"
    },
    "English(Ireland)": {
        "languageCode": "en-IE"
    },
    "English(Kenya)": {
        "languageCode": "en-KE"
    },
    "English(New Zealand)": {
        "languageCode": "en-NZ"
    },
    "English(Nigeria)": {
        "languageCode": "en-NG"
    },
    "English(Pakistan)": {
        "languageCode": "en-PK"
    },
    "English(Philippines)": {
        "languageCode": "en-PH"
    },
    "English(Singapore)": {
        "languageCode": "en-SG"
    },
    "English(South Africa)": {
        "languageCode": "en-ZA"
    },
    "English(Tanzania)": {
        "languageCode": "en-TZ"
    },
    "English(United Kingdom)": {
        "languageCode": "en-GB"
    },
    "English(United States)": {
        "languageCode": "en-US"
    },
    "Estonian(Estonia)": {
        "languageCode": "et-EE"
    },
    "Finnish(Finland)": {
        "languageCode": "fi-FI"
    },
    "French(Belgium)": {
        "languageCode": "fr-BE"
    },
    "French(Canada)": {
        "languageCode": "fr-CA"
    },
    "French(France)": {
        "languageCode": "fr-FR"
    },
    "French(Switzerland)": {
        "languageCode": "fr-CH"
    },
    "Galician(Spain)": {
        "languageCode": "gl-ES"
    },
    "Georgian(Georgia)": {
        "languageCode": "ka-GE"
    },
    "German(Austria)": {
        "languageCode": "de-AT"
    },
    "German(Germany)": {
        "languageCode": "de-DE"
    },
    "German(Switzerland)": {
        "languageCode": "de-CH"
    },
    "Greek(Greece)": {
        "languageCode": "el-GR"
    },
    "Gujarati(India)": {
        "languageCode": "gu-IN"
    },
    "Hausa(Nigeria)": {
        "languageCode": "ha-NG"
    },
    "Hebrew(Israel)": {
        "languageCode": "iw-IL"
    },
    "Hindi(India)": {
        "languageCode": "hi-IN"
    },
    "Hungarian(Hungary)": {
        "languageCode": "hu-HU"
    },
    "Icelandic(Iceland)": {
        "languageCode": "is-IS"
    },
    "Igbo(Nigeria)": {
        "languageCode": "ig-NG"
    },
    "Indonesian(Indonesia)": {
        "languageCode": "id-ID"
    },
    "Italian(Italy)": {
        "languageCode": "it-IT"
    },
    "Italian(Switzerland)": {
        "languageCode": "it-CH"
    },
    "Japanese(Japan)": {
        "languageCode": "ja-JP"
    },
    "Javanese(Indonesia)": {
        "languageCode": "jv-ID"
    },
    "Kannada(India)": {
        "languageCode": "kn-IN"
    },
    "Kazakh(Kazakhstan)": {
        "languageCode": "kk-KZ"
    },
    "Khmer(Cambodia)": {
        "languageCode": "km-KH"
    },
    "Kinyarwanda(Rwanda)": {
        "languageCode": "rw-RW"
    },
    "Korean(South Korea)": {
        "languageCode": "ko-KR"
    },
    "Lao(Laos)": {
        "languageCode": "lo-LA"
    },
    "Latvian(Latvia)": {
        "languageCode": "lv-LV"
    },
    "Lithuanian(Lithuania)": {
        "languageCode": "lt-LT"
    },
    "Macedonian(North Macedonia)": {
        "languageCode": "mk-MK"
    },
    "Malay(Malaysia)": {
        "languageCode": "ms-MY"
    },
    "Malayalam(India)": {
        "languageCode": "ml-IN"
    },
    "Marathi(India)": {
        "languageCode": "mr-IN"
    },
    "Mongolian(Mongolia)": {
        "languageCode": "mn-MN"
    },
    "Nepali(Nepal)": {
        "languageCode": "ne-NP"
    },
    "Norwegian Bokmal(Norway)": {
        "languageCode": "no-NO"
    },
    "Persian(Iran)": {
        "languageCode": "fa-IR"
    },
    "Polish(Poland)": {
        "languageCode": "pl-PL"
    },
    "Punjabi(Gurmukhi India)": {
        "languageCode": "pa-Guru-IN"
    },
    "Romanian(Romania)": {
        "languageCode": "ro-RO"
    },
    "Russian(Russia)": {
        "languageCode": "ru-RU"
    },
    "Sepedi(South Africa)": {
        "languageCode": "nso-ZA"
    },
    "Serbian(Serbia)": {
        "languageCode": "sr-RS"
    },
    "Slovak(Slovakia)": {
        "languageCode": "sk-SK"
    },
    "Slovenian(Slovenia)": {
        "languageCode": "sl-SI"
    },
    "Spanish(Argentina)": {
        "languageCode": "es-AR"
    },
    "Spanish(Bolivia)": {
        "languageCode": "es-BO"
    },
    "Spanish(Chile)": {
        "languageCode": "es-CL"
    },
    "Spanish(Colombia)": {
        "languageCode": "es-CO"
    },
    "Spanish(Costa Rica)": {
        "languageCode": "es-CR"
    },
    "Spanish(Dominican Republic)": {
        "languageCode": "es-DO"
    },
    "Spanish(Ecuador)": {
        "languageCode": "es-EC"
    },
    "Spanish(El Salvador)": {
        "languageCode": "es-SV"
    },
    "Spanish(Guatemala)": {
        "languageCode": "es-GT"
    },
    "Spanish(Honduras)": {
        "languageCode": "es-HN"
    },
    "Spanish(Mexico)": {
        "languageCode": "es-MX"
    },
    "Spanish(Nicaragua)": {
        "languageCode": "es-NI"
    },
    "Spanish(Panama)": {
        "languageCode": "es-PA"
    },
    "Spanish(Paraguay)": {
        "languageCode": "es-PY"
    },
    "Spanish(Peru)": {
        "languageCode": "es-PE"
    },
    "Spanish(Puerto Rico)": {
        "languageCode": "es-PR"
    },
    "Spanish(Spain)": {
        "languageCode": "es-ES"
    },
    "Spanish(United States)": {
        "languageCode": "es-US"
    },
    "Spanish(Uruguay)": {
        "languageCode": "es-UY"
    },
    "Spanish(Venezuela)": {
        "languageCode": "es-VE"
    },
    "Sundanese(Indonesia)": {
        "languageCode": "su-ID"
    },
    "Swahili": {
        "languageCode": "sw"
    },
    "Swahili(Kenya)": {
        "languageCode": "sw-KE"
    },
    "Swahili(Tanzania)": {
        "languageCode": "sw-TZ"
    },
    "Swati(Latin, South Africa)": {
        "languageCode": "ss-Latn-ZA"
    },
    "Swedish(Sweden)": {
        "languageCode": "sv-SE"
    },
    "Tamil(India)": {
        "languageCode": "ta-IN"
    },
    "Tamil(Malaysia)": {
        "languageCode": "ta-MY"
    },
    "Tamil(Singapore)": {
        "languageCode": "ta-SG"
    },
    "Tamil(Sri Lanka)": {
        "languageCode": "ta-LK"
    },
    "Telugu(India)": {
        "languageCode": "te-IN"
    },
    "Thai(Thailand)": {
        "languageCode": "th-TH"
    },
    "Tsonga(South Africa)": {
        "languageCode": "ts-ZA"
    },
    "Tswana(Latin, South Africa)": {
        "languageCode": "tn-Latn-ZA"
    },
    "Turkish(Turkey)": {
        "languageCode": "tr-TR"
    },
    "Ukrainian(Ukraine)": {
        "languageCode": "uk-UA"
    },
    "Urdu(India)": {
        "languageCode": "ur-IN"
    },
    "Urdu(Pakistan)": {
        "languageCode": "ur-PK"
    },
    "Uzbek(Uzbekistan)": {
        "languageCode": "uz-UZ"
    },
    "Vietnamese(Vietnam)": {
        "languageCode": "vi-VN"
    },
    "Xhosa(South Africa)": {
        "languageCode": "xh-ZA"
    },
    "Yoruba(Nigeria)": {
        "languageCode": "yo-NG"
    },
    "Zulu(South Africa)": {
        "languageCode": "zu-ZA"
    }
}`

const langs = JSON.parse(STText)
async function transcribeVideo(audioFilePath,sourceLanguage) {
    // const storage = new Storage();   
    // const bucketName = 'polylingua-videos';
    // const gcsFileName = 'cultur.mp4'; // Name of the file in GCS

    // // Upload the audio file to Google Cloud Storage
    // await storage.bucket(bucketName).upload(audioFilePath, {
    //     destination: gcsFileName,
    // });
    const speechClient = new SpeechClient();
    let sourceL = langs[sourceLanguage]["languageCode"]
    // Configure the audio settings for the audio content
    // const audio = {
    //     uri: `gs://${bucketName}/${gcsFileName}`,
    // };
    const audio = {
        uri: audioFilePath,
    };
    // Specifies the language of the audio
    const config = {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: sourceL,
        enableWordTimeOffsets: true,
    };

    // Combines the audio data with the speech recognition config
    const request = {
        audio: audio,
        config: config,
    };

    // Perform speech recognition on the audio file using LongRunningRecognize
    const [operation] = await speechClient.longRunningRecognize(request);

    // Wait for the operation to complete
    const [response] = await operation.promise();

    const timestamps = response.results
        .flatMap(result => result.alternatives[0].words)
        .map(wordInfo => ({
            word: wordInfo.word,
            start: parseFloat(wordInfo.startTime.seconds) + parseFloat(wordInfo.startTime.nanos) / 1e9,
            end: parseFloat(wordInfo.endTime.seconds) + parseFloat(wordInfo.endTime.nanos) / 1e9,
        }));

    console.log('Transcribed successfully');
    return timestamps;
}

module.exports = { transcribeVideo };
const inputVideoPath = 'gs://polylingua-videos/videoplayback.mp4';
const audioFilePath = 'd:/Загрузки/cultur.mp4';

