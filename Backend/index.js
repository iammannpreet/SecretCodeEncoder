import express from 'express';
import cors from 'cors';
import { getCoordinatesForString, updateCoordinatesJson, getCoordinatesFromJson } from './coordinateHandler.js';
import pixelData from './pixelData.js'; // Import from external file
const app = express();
app.use(express.json());
app.use(cors());
// Function to render pixelated text
function renderPixelatedText(inputString) {
    const inputCharacters = inputString.toUpperCase().split("");
    const renderedRows = Array(6).fill("");

    inputCharacters.forEach((char) => {
        const charPixels = pixelData[char] || Array(6).fill("          "); // Default to empty space
        for (let i = 0; i < 6; i++) {
            renderedRows[i] += charPixels[i] + "  "; // Add space between characters
        }
    });

    return renderedRows.join("\n");
}
app.get('/retrieve-coordinates', (req, res) => {
    const { input } = req.query;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid input key.' });
    }

    try {
        const coordinates = getCoordinatesFromJson(input);
        res.json({ input, coordinates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/render-pixelated-text', (req, res) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const inputCharacters = input.toUpperCase().split("");
    const renderedRows = Array(6).fill(""); // Create an array of rows

    inputCharacters.forEach((char) => {
        const charPixels = pixelData[char] || Array(6).fill("          "); // Default to blank
        for (let i = 0; i < 6; i++) {
            renderedRows[i] += charPixels[i] + "  "; // Append each row of the character
        }
    });

    res.json({ renderedText: renderedRows }); // Send as an array
});


app.post('/generate-secret-message', (req, res) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid input string.' });
    }

    try {
        const coordinates = getCoordinatesForString(input);
        updateCoordinatesJson(input, coordinates);

        res.json({
            message: `Coordinates for '${input}' saved successfully.`,
            coordinates,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
