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


async function translateText(text, targetLanguage) {
    const chunks = [];
    let resultText = ``;
    for (let i = 0; i < text.length; i += 2500) {
        chunks.push(text.substring(i, i + 2500));
    }
    for (let i = 0; i < text.length; i += 2500) {
        const [translationResponse] = await translationClient.translateText({
            parent: `projects/polylingua/locations/global`,
            contents: [chunks[i]],
            mimeType: 'text/plain',
            targetLanguageCode: targetLanguage,
        });

        let translatedText = translationResponse.translations[0].translatedText;
        resultText += translatedText;
    }
    return resultText;
}

module.exports = {translateAndGenerateSSML }
