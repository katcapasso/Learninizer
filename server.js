const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003', // Change to the model you use
                prompt: prompt,
                max_tokens: 100,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        res.status(200).json({ generatedText: response.data.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating text');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
