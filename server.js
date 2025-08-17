
const dotenv =require('dotenv');
dotenv.config()
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Import your custom modules
const recognizeCarModel = require('./recognize_car_model');
const getCarImageUrl = require('./car_image');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));


// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('carImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // 1. Recognize the car model from the uploaded image
        const carInfo = await recognizeCarModel(req.file.buffer);

        if (!carInfo || !carInfo.manufacturer || !carInfo.model) {
            return res.status(500).json({ error: 'Could not recognize the car model.' });
        }

        // 2. Get the car image URL from Google Search
        const carModel = `${carInfo.year} ${carInfo.manufacturer} ${carInfo.model}`;
        const imageUrl = await getCarImageUrl(carModel);

        // 3. Combine the results and send them to the client
        const result = {
            ...carInfo,
            imageUrl: imageUrl
        };

        res.json(result);

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
