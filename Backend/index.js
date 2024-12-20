import express from 'express';
import cors from 'cors';
import { getCoordinatesForString, updateCoordinatesJson, getCoordinatesFromJson } from './coordinateHandler.js';
import pixelData from './pixelData.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid'; // Install this library with `npm install uuid`
import fs from 'fs';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(cors());
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Function to render pixelated text
function generateHashKey(input, length = 8) {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return hash.substring(0, length); // Truncate to 8 characters
}
function renderPixelatedText(inputString) {
    const inputCharacters = inputString.toUpperCase().split("");
    const renderedRows = Array(6).fill("");

    inputCharacters.forEach((char) => {
        const charPixels = pixelData[char] || Array(6).fill("          "); // Default to blank
        for (let i = 0; i < 6; i++) {
            renderedRows[i] += charPixels[i] + "  "; // Append each row of the character
        }
    });

    return renderedRows; // Return as an array
}

app.get('/retrieve-coordinates', (req, res) => {
    const { input } = req.query;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid input key.' });
    }

    try {
        const filePath = path.resolve(__dirname, 'pixelCoordinates.json');

        if (!fs.existsSync(filePath)) {
            throw new Error('pixelCoordinates.json does not exist.');
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        if (!data[input]) {
            throw new Error(`Key '${input}' not found.`);
        }

        const { coordinates } = data[input];
        res.json({
            message: `Coordinates for '${input}' retrieved successfully.`,
            coordinates,
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


// POST: Render pixelated text
app.post('/render-pixelated-text', (req, res) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const renderedText = renderPixelatedText(input);
        res.json({
            message: `Pixelated text for '${input}' rendered successfully.`,
            renderedText,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/generate-secret-message', (req, res) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid input string.' });
    }

    try {
        // Generate a unique key using SHA256
        const uniqueKey = generateHashKey(input);

        // Log the unique key to the console
        console.log(`Generated unique key: ${uniqueKey} for input: ${input}`);

        // Generate coordinates for the input string
        const coordinates = getCoordinatesForString(input);

        // Update the pixelCoordinates.json file with the new key
        const filePath = path.resolve(__dirname, 'pixelCoordinates.json');
        const currentData = fs.existsSync(filePath)
            ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
            : {};
        currentData[uniqueKey] = { input, coordinates };

        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

        res.json({
            message: `Coordinates for '${input}' saved successfully.`,
            key: uniqueKey, // Return the unique key
            coordinates, // Return the coordinates
        });
    } catch (error) {
        console.error('Error generating secret message:', error);
        res.status(500).json({ error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
