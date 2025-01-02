const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS
const axios = require('axios'); // Import Axios
const dotenv = require('dotenv'); // Import Dotenv
const path = require('path'); // Import Path for static file serving

dotenv.config(); // Load environment variables from .env file

const app = express(); // Initialize Express
const port = 3000; // Define the port for the server

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON parsing for incoming requests
app.use(express.static('public')); // Serve static files from the "public" directory

// API Endpoint for ChatGPT
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const generatedText = response.data.choices[0].message.content;
        res.json({ generatedText });
    } catch (error) {
        console.error('Error generating text:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




