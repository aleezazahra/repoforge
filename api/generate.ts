import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).json({ message: "API Active" });

  const token = (process.env.AI_SECRET_KEY || '').trim();
  const { repoUrl } = req.body;

  if (!token) {
    return res.status(500).json({ error: "AI_SECRET_KEY is missing. Check Vercel Dashboard." });
  }

  
  const models = [
    "zai-org/GLM-5",              
    "deepseek-ai/DeepSeek-V3",    
    "Qwen/Qwen3-Coder-32B",       
    "mistralai/Mixtral-8x22B-v0.3" 
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true",
          },
          method: "POST",
          body: JSON.stringify({
            model: model, 
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

      if (response.status === 503 || response.status === 404 || response.status === 429) {
        console.warn(`Model ${model} failed with status ${response.status}. Trying next...`);
        continue; 
      }

      if (data.choices && data.choices[0]?.message?.content) {
        return res.status(200).json({ 
          generated_text: data.choices[0].message.content,
          model_used: model 
        });
      }

    } catch (error: any) {
      console.error(`Error with model ${model}:`, error.message);
      continue; 
    }
  }

  return res.status(500).json({ 
    error: "All models are currently overloaded. Please try again in 30 seconds." 
  });
}
