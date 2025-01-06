// Select elements
const fileUpload = document.getElementById("file-upload");
const extractedText = document.getElementById("extracted-text");
const highlightBtn = document.getElementById("highlight-btn");
const selectedText = document.getElementById("selected-text");
const createImageBtn = document.getElementById("create-image-btn");
const saveImageBtn = document.getElementById("save-image-btn");
const imageCanvas = document.getElementById("image-canvas");
const ctx = imageCanvas?.getContext("2d");
const generateImageBtn = document.getElementById("generate-image-btn");
const generatedImage = document.getElementById("generated-image");
const submitPromptBtn = document.getElementById("submit-prompt-btn");
const userPrompt = document.getElementById("user-prompt");
const responseText = document.getElementById("response-text");
const uploadFeedback = document.getElementById("upload-feedback");

// API base URL
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://learninizer.vercel.app";

// Helper: Test API connection
(async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`Backend not reachable: ${response.statusText}`);
    }
    console.log("Backend connection successful.");
  } catch (error) {
    console.error("Failed to connect to backend:", error.message);
    alert("Backend connection failed. Ensure your server is running.");
  }
})();

// OCR Process
fileUpload?.addEventListener("change", async () => {
  const file = fileUpload.files[0];
  if (!file) return alert("Please select a file to upload.");

  const formData = new FormData();
  formData.append("file", file);

  uploadFeedback.textContent = "Uploading and processing file...";

  try {
    const response = await fetch(`${API_BASE_URL}/extract-text`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error during text extraction.");

    const data = await response.json();
    extractedText.value = data.extractedText || "No text extracted.";
    uploadFeedback.textContent = "File processed successfully!";
  } catch (error) {
    console.error("Error during OCR process:", error.message);
    uploadFeedback.textContent = "Failed to process the file.";
    alert(error.message);
  }
});

// Highlight Text
highlightBtn?.addEventListener("click", () => {
  const text = extractedText.value;
  if (text) {
    selectedText.value = text.substring(0, 200); // Highlight first 200 chars
  } else {
    alert("No text available to highlight.");
  }
});

// Create Image from Text
createImageBtn?.addEventListener("click", () => {
  const text = selectedText.value.trim();
  if (!text) return alert("Please select or enter text to create an image.");

  const lines = Math.ceil(text.length / 80); // Approx 80 chars per line
  imageCanvas.width = 800;
  imageCanvas.height = lines * 30;
  ctx.fillStyle = "#f1f1f1";
  ctx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";

  const words = text.split(" ");
  let line = "";
  let y = 30;

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > 760) {
      ctx.fillText(line, 20, y);
      line = `${word} `;
      y += 30;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, 20, y);
});

// Save Image
saveImageBtn?.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "text-image.png";
  link.href = imageCanvas.toDataURL();
  link.click();
});

// Generate Image using AI
generateImageBtn?.addEventListener("click", async () => {
  const prompt = selectedText.value.trim();
  if (!prompt) return alert("Please enter or highlight text to generate an image.");

  try {
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("Error generating image.");

    const data = await response.json();
    if (data.imageUrl) {
      generatedImage.src = data.imageUrl;
      generatedImage.style.display = "block";
    } else {
      alert("Failed to generate image. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
});

// Fetch ChatGPT Response
async function fetchChatGPTResponse(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("Error fetching ChatGPT response.");

    const data = await response.json();
    responseText.innerText = data.generatedText || "No response received.";
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error.message);
    responseText.innerText = "Failed to fetch response.";
  }
}

// ChatGPT Prompt Submission
submitPromptBtn?.addEventListener("click", () => {
  const prompt = userPrompt.value.trim();
  if (!prompt) return alert("Please enter a prompt.");
  fetchChatGPTResponse(prompt);
});
