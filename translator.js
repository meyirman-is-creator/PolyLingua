const { transcribeVideo } = require('./transcript2.js');
const { translateAndGenerateSSML } = require('./divider.js');
const { generateAudioFromSSML } = require('./speechGenerator.js');
const { Storage } = require('@google-cloud/storage');

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5501;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const storageClient = new Storage();   
const bucketName = 'polylingua-videos';

app.use(cors()); // разрешаем CORS для всех маршрутов
app.use(bodyParser.json());
// Парсим тело запроса в формате JSON
app.use(bodyParser.json());
// const fs = require('fs');

async function main(audioFilePath,targetLanguage,sourceLanguage){
    console.log('Main running');
    console.log(audioFilePath);
    console.log(targetLanguage);
    console.log(sourceLanguage);
    
    const timestamps = await transcribeVideo(audioFilePath,sourceLanguage);
    const ssmls = await translateAndGenerateSSML(timestamps,targetLanguage);
    const concatenatedAudio = await generateAudioFromSSML(ssmls,targetLanguage);

    return concatenatedAudio;
}

app.get('/api/data', (req, res) => {
    // Здесь может быть ваша логика обработки запроса
    // В этом примере просто отправляем обратно сообщение "Привет от сервера!"
    res.send('Привет от сервера!');
  });
  
  // Обработчик POST запроса
  app.post('/api/data', async (req, res) => {
    // Получаем данные из тела POST запроса
    const requestData = req.body;
    const path = requestData.path;
    const optionFrom = requestData.optionFrom ;
    const optionTo = requestData.optionTo;
    try {
        // Call the main function to generate the audio
        const concatenatedAudio = await main(path, optionTo, optionFrom);

        // Send the audio file data as a response
        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-Length': concatenatedAudio.length
        });
        res.end(concatenatedAudio);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
    // Здесь может быть ваша логика обработки данных
    console.log('POST запрос получен:');
  
    // Отправляем ответ клиенту
  });
  app.post('/upload-video', upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }
  
      // Upload the video file to Google Cloud Storage
      const bucket = storageClient.bucket(bucketName);
      const filename = `${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(filename);
  
      const fileStream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });
  
      fileStream.end(req.file.buffer);
  
      fileStream.on('finish', () => {
        const videoUrl = `https://storage.cloud.google.com/${bucketName}/${filename}`;
        const videoUri = `gs://${bucketName}/${filename}`
        console.log("Success! ",videoUri," ",videoUrl);
        res.json({ videoUrl: videoUrl, videoUri: videoUri});
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
  // Запускаем сервер на порту 3000
  app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
  });