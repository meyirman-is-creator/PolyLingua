const { Storage } = require('@google-cloud/storage');
const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;

async function transcribeVideo(audioFilePath) {
    // const storage = new Storage();
    // const bucketName = 'polylingua-videos';
    // const gcsFileName = 'cultur.mp4'; // Name of the file in GCS

    // // Upload the audio file to Google Cloud Storage
    // await storage.bucket(bucketName).upload(audioFilePath, {
    //     destination: gcsFileName,
    // });

    const speechClient = new SpeechClient();

    // Configure the audio settings for the audio content
    // const audio = {
    //     uri: `gs://${bucketName}/${gcsFileName}`,
    // };
    const audio = {
        uri: `gs://polylingua-videos/videoplayback.mp4`,
    };
    // Specifies the language of the audio
    const config = {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
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
async function main(){
    const timestamps = await transcribeVideo(audioFilePath);
    console.log("Times",timestamps);
}
main().catch(console.error);
