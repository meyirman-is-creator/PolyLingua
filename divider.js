const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const {voices} = require('./speechGenerator');
const translationClient = new TranslationServiceClient();

function divideTranscriptWithPauses(timestamps) {
    const segments = [];
    let currentSegment = '';
    let pauseBeforeSegment = 0;

    const MAX_SEGMENT_SIZE = 4000; // Maximum segment size in bytes

    timestamps.forEach(({ start, end, word }, index) => {
        if (index === 0) {
            pauseBeforeSegment = start;
        }

        // Calculate pause duration between segments
        const pauseDuration = index > 0 ? start - timestamps[index - 1].end : 0;

        // Check if adding the current word exceeds the maximum segment size
        if (currentSegment.length + word.length > MAX_SEGMENT_SIZE) {
            // If the segment exceeds the maximum size, push the current segment and reset it
            segments.push({ segment: currentSegment.trim(), pauseBeforeSegment: pauseBeforeSegment.toFixed(1) });
            currentSegment = '';
            pauseBeforeSegment = 0; // Reset pause for the next segment
        }

        if (pauseDuration > 0) {
            // If a pause exists, push the current segment and its pause duration
            if (currentSegment.trim().length > 0) {
                segments.push({ segment: currentSegment.trim(), pauseBeforeSegment: pauseBeforeSegment.toFixed(1) });
                currentSegment = '';
            }
            pauseBeforeSegment = Number(pauseDuration.toFixed(1)); // Format pause duration
        }

        currentSegment += `${word} `;
    });

    // Add the last segment if any
    if (currentSegment.trim().length > 0) {
        segments.push({ segment: currentSegment.trim(), pauseBeforeSegment: pauseBeforeSegment.toFixed(1) });
    }


    return segments;
}

async function translateAndGenerateSSML(timestamps,targetLanguage) {
    segmentsWithPauses = divideTranscriptWithPauses(timestamps)
    const translatedSegments = [];
    const target = voices[targetLanguage].languageCode.slice(0,2)
    // Iterate through each segment
    for (const { segment, pauseBeforeSegment } of segmentsWithPauses) {
        // Translate the text
        const translatedText = await translateText(segment, target);

        // Generate SSML for the translated text and pause
        const ssml = `<speak><break time="${pauseBeforeSegment}s"/>${translatedText}</speak>`;

        // Push the translated text and SSML to the array
        translatedSegments.push({ ssml: ssml });
    }  
    console.log('SSML generated successfully');
    return translatedSegments;
}


// Example translation function (replace with actual translation logic)
async function translateText(text, targetLanguage) {
    const chunks = [];
    let resultText = ``;
    for (let i = 0; i < text.length; i += 2500) {
        chunks.push(text.substring(i, i + 2500));
    }
    for (let i = 0; i < text.length; i += 2500) {
    // Example translation using a hypothetical translation API
        const [translationResponse] = await translationClient.translateText({
            parent: `projects/polylingua/locations/global`,
            contents: [chunks[i]],
            mimeType: 'text/plain',
            targetLanguageCode: targetLanguage,
        });
        // const [response] = await translationResponse.promise();

        let translatedText = translationResponse.translations[0].translatedText;
        resultText += translatedText;
    }
    return resultText;
    // return `Translated ${text} to ${targetLanguage}`;
}

module.exports = {translateAndGenerateSSML }
// Example usage:
// async function main(){
//     const transcript = `so now I am talking about something to find appropriate audio or video files for testing your code with Google Cloud speech to text API you have several options`;
// const timestamps = [
//     { word: 'so', start: 1.1, end: 1.5 },
//     { word: 'now', start: 1.5, end: 2.1 },
//     { word: 'I', start: 2.1, end: 2.6 },
//     { word: 'am', start: 2.6, end: 2.7 },
//     { word: 'talking', start: 2.7, end: 2.9 },
//     { word: 'about', start: 2.9, end: 3.3 },
//     { word: 'something', start: 3.3, end: 4.3 },
//     { word: 'find', start: 12.5, end: 12.7 },
//     { word: 'appropriate', start: 12.7, end: 13.4 },
//     { word: 'audio', start: 13.4, end: 14.2 },
//     { word: 'or', start: 14.2, end: 14.6 },
//     { word: 'video', start: 14.6, end: 15 },
//     { word: 'files', start: 15, end: 15.5 },
//     { word: 'for', start: 15.5, end: 15.8 },
//     { word: 'testing', start: 15.8, end: 16.4 },
//     { word: 'your', start: 16.4, end: 16.9 },
//     { word: 'code', start: 16.9, end: 17.4 },
//     { word: 'with', start: 17.4, end: 17.6 },
//     { word: 'Google', start: 17.6, end: 17.9 },
//     { word: 'Cloud', start: 17.9, end: 18.3 },
//     { word: 'speech', start: 19.3, end: 19.8 },
//     { word: 'to', start: 19.8, end: 20 },
//     { word: 'text', start: 20, end: 20.2 },
//     { word: 'API', start: 20.2, end: 20.7 },
//     { word: 'you', start: 29.9, end: 30.3 },
//     { word: 'have', start: 30.3, end: 30.5 },
//     { word: 'several', start: 30.5, end: 31.2 },
//     { word: 'options', start: 31.2, end: 31.7 },
    // Add more timestamps here
// ];
// targetLanguage = 'ru';
// const segmentsWithPauses = divideTranscriptWithPauses(transcript, timestamps);
// console.log('Segments with pauses',segmentsWithPauses);
// const result = await translateAndGenerateSSML(segmentsWithPauses,targetLanguage)
// console.log('Result = ',result)
// }
// main().catch(console.error);