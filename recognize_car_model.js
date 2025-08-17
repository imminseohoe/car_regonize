// recognize_car_model.js

// 수정 전: const fetch = require('node-fetch');
// 수정 후:
const axios = require('axios');

async function getCarInfoFromGemini(imageBuffer) {
  // Replace with your actual API key.
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }
  const MODEL = "gemini-2.0-flash-lite";
  // The prompt for Gemini API.
  const prompt = `Analyze the provided image of a car and extract the following information:
- Make
- Model
- Year
- Color
- the trim level (e.g., Limited, Premium)
- Price
- If possible, key features of the vehicle (e.g., wheel design, headlight shape)
Please provide a confidence level. Respond in JSON format
example:
{ "manufacturer": "Hyundai",
  "model": "Sonata",
  "year": "2023",
  "color": "Silver",
  "trim": "Premium",
  "price": "$5000",
  "confidence": "95%"
}`;

  try {
    // Convert the image buffer to a Base64 string.
    const base64Image = imageBuffer.toString('base64');

    // Create the request payload.
    const payload = {
      "contents": [
        {
          "parts": [
            { "text": prompt },
            {
              "inlineData": {
                "mimeType": "image/jpeg", // Assuming JPEG, adjust if necessary
                "data": base64Image
              }
            }
          ]
        }
      ],
      "generationConfig": {
        "responseMimeType": "application/json"
      }
    };
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // Make the API call using axios.
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // axios returns data in response.data
    const result = response.data;
    const content = result.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(content);

    console.log("Parsed JSON response:");
    console.log(parsedData);

    return parsedData;

  } catch (error) {
    // Enhanced error logging for axios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response Data:", error.response.data);
      console.error("API Error Response Status:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Error:", error.message);
    }
    return null;
  }
}

module.exports = getCarInfoFromGemini;