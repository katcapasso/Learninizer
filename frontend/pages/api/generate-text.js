// frontend/pages/api/generate-text.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "No prompt provided." });
      }
  
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
          }),
        });
  
        const data = await response.json();
        const generatedText = data.choices[0].message.content;
  
        res.status(200).json({ generatedText });
      } catch (error) {
        console.error("Error generating text:", error);
        res.status(500).json({ error: "Error generating text" });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  }
  