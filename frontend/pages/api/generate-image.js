// frontend/pages/api/generate-image.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "No prompt provided." });
      }
  
      try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "512x512",
          }),
        });
  
        const data = await response.json();
        if (data.data && data.data[0].url) {
          return res.status(200).json({ imageUrl: data.data[0].url });
        } else {
          return res.status(500).json({ error: "Failed to generate image" });
        }
      } catch (error) {
        console.error("Image generation error:", error);
        return res.status(500).json({ error: "Error generating image" });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  }
  