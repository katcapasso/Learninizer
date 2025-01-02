// Select elements
const fileUpload = document.getElementById('file-upload');
const extractedText = document.getElementById('extracted-text');
const highlightBtn = document.getElementById('highlight-btn');
const selectedText = document.getElementById('selected-text');
const createImageBtn = document.getElementById('create-image-btn');
const saveImageBtn = document.getElementById('save-image-btn');
const imageCanvas = document.getElementById('image-canvas');
const ctx = imageCanvas.getContext('2d');
const generateImageBtn = document.getElementById('generate-image-btn');
const generatedImage = document.getElementById('generated-image');

// New Elements for ChatGPT
const submitPromptBtn = document.getElementById('submit-prompt-btn');
const userPrompt = document.getElementById('user-prompt');
const responseText = document.getElementById('response-text');

// OCR Process
fileUpload.addEventListener('change', () => {
  const file = fileUpload.files[0];
  if (file) {
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => {
        extractedText.value = text;
      })
      .catch((err) => {
        console.error('Error during OCR:', err);
      });
  }
});

// Highlight Text
highlightBtn.addEventListener('click', () => {
  selectedText.value = extractedText.value.substring(0, 200); // Highlight first 200 characters
});

// Create Image from Text
createImageBtn.addEventListener('click', () => {
  const text = selectedText.value;
  imageCanvas.width = 800;
  imageCanvas.height = 200;
  ctx.fillStyle = '#f1f1f1'; 
  ctx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.fillStyle = '#000'; 
  ctx.font = '20px Arial';
  ctx.fillText(text, 20, 100, 760); 
});

// Save Image
saveImageBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'text-image.png';
  link.href = imageCanvas.toDataURL();
  link.click();
});

// Generate Image using DALL·E API
generateImageBtn.addEventListener('click', async () => {
  const prompt = selectedText.value.trim();
  const apiKey = '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'; // Replace with your OpenAI API key
  const apiUrl = 'https://api.openai.com/v1/images/generations';

  if (!prompt) {
    alert('Please enter or highlight text to generate an image.');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Create a visually appealing educational image with the following text: "${prompt}"`,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      throw new Error('Error generating image');
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    generatedImage.src = imageUrl;
    generatedImage.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate image. Please check your API key or try again later.');
  }
});

// Fetch ChatGPT Response
async function fetchChatGPTResponse(prompt) {
  try {
    const response = await fetch('http://localhost:3000/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error('Error fetching ChatGPT response.');
    }

    const data = await response.json();
    responseText.innerText = data.generatedText; 
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    responseText.innerText = 'Failed to fetch response. Please try again.';
  }
}

// ChatGPT Prompt Submission
submitPromptBtn.addEventListener('click', () => {
  const prompt = userPrompt.value.trim();
  if (prompt) {
    fetchChatGPTResponse(prompt);
  } else {
    alert('Please enter a prompt.');
  }
});
