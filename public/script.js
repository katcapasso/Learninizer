const fileUpload = document.getElementById('file-upload');
const extractedText = document.getElementById('extracted-text');
const highlightBtn = document.getElementById('highlight-btn');
const selectedText = document.getElementById('selected-text');
const createImageBtn = document.getElementById('create-image-btn');
const saveImageBtn = document.getElementById('save-image-btn');
const imageCanvas = document.getElementById('image-canvas');
const ctx = imageCanvas.getContext('2d');

fileUpload.addEventListener('change', () => {
  const file = fileUpload.files[0];
  if (file) {
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => {
        extractedText.value = text;
      })
      .catch(err => {
        console.error('Error during OCR:', err);
      });
  }
});

highlightBtn.addEventListener('click', () => {
  selectedText.value = extractedText.value.substring(0, 200);
});

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

saveImageBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'text-image.png';
  link.href = imageCanvas.toDataURL();
  link.click();
});
