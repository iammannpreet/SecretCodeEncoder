import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pixelData from './pixelData.js';

export function getCoordinatesForLetter(letter) {
    const rows = pixelData[letter.toUpperCase()];
    if (!rows) {
        throw new Error(`No pixel data found for letter: ${letter}`);
    }

    const coordinates = [];
    rows.forEach((row, y) => {
        [...row].forEach((char, x) => {
            if (char !== " ") { // Exclude blank spaces
                coordinates.push({ x, y, character: char });
            }
        });
    });

    return coordinates;
}

export function getCoordinatesForString(input) {
    const allCoordinates = [];
    let xOffset = 0;

    input.toUpperCase().split("").forEach((char) => {
        const letterCoordinates = getCoordinatesForLetter(char);

        // Offset coordinates for the current character
        letterCoordinates.forEach(({ x, y, character }) => {
            allCoordinates.push({
                x: x + xOffset, // Apply offset for current character
                y,
                character
            });
        });

        // Increase xOffset for the next character
        xOffset += pixelData[char][0].length + 2; // Add 2 spaces between characters
    });

    return allCoordinates;
}

export function updateCoordinatesJson(input, coordinates) {
    const filePath = path.resolve(__dirname, 'pixelCoordinates.json');

    let currentData = {};
    try {
        const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '{}';
        currentData = JSON.parse(fileContent || '{}');
    } catch (error) {
        console.warn('pixelCoordinates.json is missing or invalid. Initializing new file.');
        currentData = {};
    }

    console.log('Updating pixelCoordinates.json at:', filePath);
    console.log('Current data before update:', currentData);

    // Add or update the data for the input
    currentData[input.toUpperCase()] = coordinates;

    try {
        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
        console.log('File updated successfully');
    } catch (error) {
        console.error('Error writing to pixelCoordinates.json:', error.message);
        throw error;
    }
}
