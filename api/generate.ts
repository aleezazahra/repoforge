import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).json({ message: "API Active" });

  const token = (process.env.AI_SECRET_KEY || '').trim();
  const { repoUrl } = req.body;

  if (!token) {
    return res.status(500).json({ error: "AI_SECRET_KEY is missing. Check Vercel Dashboard." });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "zai-org/GLM-5", 
          messages: [
            { 
              role: "system", 
              content: "You are a senior developer. Create a technical, high-quality GitHub README.md for the following repository URL. Structure it with an Intro of two three lines, Key Features, and Installation steps. dont use emojis and if the input doesnt match any repo available on the internet tell the user to upload a proper link of a public repo" 
            },
            { role: "user", content: `Generate a README for: ${repoUrl}` }
          ],
          max_tokens: 2048, 
          temperature: 0.7,
          top_p: 0.95,     
          stream: false
        }),
      }
    );

    const data = await response.json();

 
    if (response.status === 503) {
      return res.status(503).json({ error: "GLM-5 is currently busy. Wait 15 seconds and try again." });
    }

    if (data.choices && data.choices[0]?.message?.content) {
      return res.status(200).json({ 
        generated_text: data.choices[0].message.content 
      });
    }

    
    return res.status(500).json({ 
      error: "Model is waking up or overloaded. Please click Generate once more." 
    });

  } catch (error: any) {
    return res.status(500).json({ error: "Server Error: " + error.message });
  }
}
