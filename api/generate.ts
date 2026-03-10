import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") {
    return res.status(200).json({ message: "API Active" });
  }

  const token = (process.env.AI_SECRET_KEY || "").trim();
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "No repository URL provided." });
  }

  if (!token) {
    return res.status(500).json({
      error: "AI_SECRET_KEY is missing. Check Vercel Dashboard.",
    });
  }


  const models = [
    "meta-llama/Llama-3.1-8B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "google/gemma-2-9b-it",
    "Qwen/Qwen2.5-Coder-7B-Instruct"
  ];

  for (const model of models) {
    try {

      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true"
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a senior developer. Create a technical high quality GitHub README.md for the repository URL given. Include an introduction, key features and installation steps. Do not use emojis."
              },
              {
                role: "user",
                content: `Generate a README for: ${repoUrl}`
              }
            ],
            max_tokens: 1200,
            temperature: 0.6
          }),
        }
      );

      const data = await response.json();


      if (!response.ok || data?.error) {
        console.warn(`Model ${model} failed`, data?.error || response.status);
        continue;
      }

      const text = data?.choices?.[0]?.message?.content;

      if (text) {
        return res.status(200).json({
          generated_text: text,
          model_used: model
        });
      }

    } catch (err) {
      console.error(`Error with ${model}`, err);
      continue;
    }
  }

  return res.status(503).json({
    error: "All models are busy. Please try again in 20 seconds."
  });
}
