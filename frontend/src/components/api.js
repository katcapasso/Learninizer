// src/api.js

// Set the backend URL using the environment variable REACT_APP_BACKEND_URL or default to 'http://localhost:4000'
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// Function to test connection with the backend
export const fetchTestData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/test`); // Check if backend is reachable
        if (!response.ok) {
            throw new Error('Failed to fetch data from backend');
        }
        const data = await response.json();
        console.log('Backend Response:', data); // Log the response from the backend
        return data;
    } catch (error) {
        console.error('Error connecting to backend:', error);
        throw error;
    }
};

// Function to generate AI image by sending a prompt to the backend
export const generateImage = async (prompt) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }) // Send the prompt in the request body
        });

        if (!response.ok) {
            const text = await response.text(); // Get the error message if the response is not ok
            throw new Error(`Error generating image: ${text}`);
        }

        const data = await response.json(); // Parse the response
        if (data.imageUrl) {
            return data.imageUrl; // Return the generated image URL
        } else {
            throw new Error('No image URL returned from the server');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};
