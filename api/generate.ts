import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).json({ message: "API Active" });


  const token = (process.env.AI_SECRET_KEY || '').trim();
  const { repoUrl } = req.body;

  if (!token) {
    return res.status(500).json({ error: "API Key is missing." });
  }


  const models = [
    "google/gemini-flash-1.5-8b",    
    "meta-llama/llama-3.1-8b-instruct", 
    "deepseek/deepseek-chat"           
  ];

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.com", 
          "X-Title": "README Generator",          
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { 
              role: "system", 
              content: "You are a senior developer. Create a technical, high-quality GitHub README.md. Intro (2-3 lines), Key Features, and Installation. No emojis. If the URL is invalid, ask for a public repo." 
            },
            { role: "user", content: `Generate a README for: ${repoUrl}` }
          ],
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.choices?.[0]?.message?.content) {
        return res.status(200).json({ 
          generated_text: data.choices[0].message.content,
          model_used: model 
        });
      }

      console.warn(`Model ${model} failed. Status: ${response.status}`);
    } catch (error: any) {
      console.error(`Error with model ${model}:`, error.message);
    }
  }

  return res.status(500).json({ error: "All models failed. Try again shortly." });
}
