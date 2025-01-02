const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Native JSON parsing middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS

// API Route to handle text generation
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        // OpenAI API request for GPT-3.5 or similar models
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions', // Updated endpoint for GPT-3.5 or newer models
            {
                model: 'gpt-3.5-turbo', // You can use gpt-4 or other models as needed
                messages: [{ role: 'user', content: prompt }], // Correct format for chat-based models
                max_tokens: 100,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        // Respond with the generated text
        res.status(200).json({ generatedText: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error generating text:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
