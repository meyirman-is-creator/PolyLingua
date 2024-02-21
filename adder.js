const { exec } = require('child_process');

async function addAudioToVideo(videoFilePath, audioFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        // Command to replace the original audio of the video with the concatenated audio
        const command = `ffmpeg -i ${videoFilePath} -i ${audioFilePath} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ${outputFilePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error adding audio to video: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`ffmpeg stderr: ${stderr}`);
                reject(stderr);
            }
            console.log(`Video with new audio has been created: ${outputFilePath}`);
            resolve();
        });
    });
}

// Usage
const videoFilePath = 'd:/Загрузки/cultur.mp4';
const audioFilePath = 'd:/Загрузки/videoplaybackTranslated.mp3';
const outputFilePath = 'd:/Загрузки/videoplaybackWithTranslatedAudio.mp4';

addAudioToVideo(videoFilePath, audioFilePath, outputFilePath)
    .then(() => {
        console.log('Audio added to video successfully.');
    })
    .catch((error) => {
        console.error('Error adding audio to video:', error);
    });
