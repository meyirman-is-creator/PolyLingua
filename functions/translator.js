const { transcribeVideo } = require('./transcript2.js');
const { translateAndGenerateSSML } = require('./divider.js');
const { generateAudioFromSSML } = require('./speechGenerator.js');
const { Storage } = require('@google-cloud/storage');
const { google } = require('googleapis');
// const functions = require('firebase-functions');
const {onRequest} = require("firebase-functions/v2/https");

require('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const port = 5501;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const storageClient = new Storage();   
const bucketName = 'polylingua-videos';
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_API_KEY, 
});

const allowedOrigins = ['https://polylingua-94f50.web.app', 'http://127.0.0.1:5500/PolyLingua'];
app.use(cors({
    origin: allowedOrigins, 
  }));
app.use(bodyParser.json());

async function main(audioFilePath, targetLanguage, sourceLanguage) {
    console.log('Main running');
    console.log(audioFilePath);
    console.log(targetLanguage);
    console.log(sourceLanguage);
    
    const timestamps = await transcribeVideo(audioFilePath, sourceLanguage);
    const ssmls = await translateAndGenerateSSML(timestamps, targetLanguage);
    const concatenatedAudio = await generateAudioFromSSML(ssmls, targetLanguage);

    return concatenatedAudio;
}
async function getYouTubeVideoDetails(videoId) {
    try {
      const response = await youtube.videos.list({
        part: 'snippet',
        id: videoId,
      });
      return response.data.items[0];
    } catch (error) {
      console.error('Error retrieving video details:', error);
      throw error;
    }
  }
function extractVideoId(url) {
    const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;

    const match = url.match(pattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}
async function uploadVideoToStorage(videoId) {
    try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(videoUrl);

        const videoDetails = await getYouTubeVideoDetails(videoId);

        const filename = `${videoDetails.snippet.title}.mp4`;

        const file = storageClient.bucket(bucketName).file(filename);

        const writeStream = file.createWriteStream({
            contentType: 'video/mp4',
        });

        ytdl(videoUrl, { quality: 'highest' })
            .pipe(writeStream)
            .on('error', (error) => {
                console.error('Error downloading video:', error);
                throw error;
            });

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        console.log(`Video '${filename}' uploaded to Google Cloud Storage`);
        return filename;
    } catch (error) {
        console.error('Error uploading video to Google Cloud Storage:', error);
        throw error;
    }
}
app.get('/api/data', (req, res) => {
    res.send('Привет от сервера!');
});

app.post('/api/data',cors({origin: allowedOrigins}) ,async (req, res) => {
    const requestData = req.body;
    const path = requestData.path;
    const optionFrom = requestData.optionFrom;
    const optionTo = requestData.optionTo;

    try {
        res.header('Access-Control-Allow-Origin', 'https://polylingua-94f50.web.app');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        const concatenatedAudio = await main(path, optionTo, optionFrom);

        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-Length': concatenatedAudio.length
        });
        res.end(concatenatedAudio);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }   
});

app.post('/upload-video', upload.single('video'),cors({origin: allowedOrigins}) ,async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'https://polylingua-94f50.web.app');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const bucket = storageClient.bucket(bucketName);
        const filename = `${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(filename);
  
        const fileStream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        fileStream.on('progress', (progress) => {
            console.log(`Uploaded ${progress.bytesWritten} bytes out of ${req.file.size}`);
        });
  
        fileStream.end(req.file.buffer);
  
        fileStream.on('finish', () => {
            const videoUrl = `https://storage.cloud.google.com/${bucketName}/${filename}`;
            const videoUri = `gs://${bucketName}/${filename}`
            console.log("Success! ", videoUri, " ", videoUrl);
            res.json({ videoUrl: videoUrl, videoUri: videoUri, name: filename});
        });
  
        fileStream.on('error', (err) => {
            console.error('Error uploading video to GCS:', err);
            res.status(500).json({ error: 'An error occurred while uploading the video' });
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
app.post('/upload-yt-video',upload.single('video'),cors({origin: allowedOrigins}) ,async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'https://polylingua-94f50.web.app');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        const youtubeLink = req.body.youtubeLink;

      if (!youtubeLink) {
          return res.status(400).json({ error: 'YouTube link is missing' });
      }
  
      const videoId = extractVideoId(youtubeLink);
      try {
          const ytfilename = await uploadVideoToStorage(videoId);
          console.log('Video upload completed successfully.');
          const ytvideoUrl = `https://storage.cloud.google.com/${bucketName}/${ytfilename}`;
          const ytvideoUri = `gs://${bucketName}/${ytfilename}`
          console.log("Success! ",ytvideoUri," ",ytvideoUrl);
          res.json({ videoUrl: ytvideoUrl, videoUri: ytvideoUri, name: ytfilename});
      } catch (error) {
          console.error('Error uploading video:', error);
      }
      const ytvideoUrl = `https://storage.cloud.google.com/${bucketName}/${ytfilename}`;
      const ytvideoUri = `gs://${bucketName}/${ytfilename}`
      console.log("Success! ",ytvideoUri," ",ytvideoUrl);
      res.json({ videoUrl: ytvideoUrl, videoUri: ytvideoUri});
  } catch (error) {
      
  }
})

exports.translate = onRequest(app);
