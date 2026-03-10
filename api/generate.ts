import type { VercelRequest, VercelResponse } from "@vercel/node";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

    // Meta
    "meta-llama/Llama-3.1-8B-Instruct",
    "meta-llama/Llama-3-8B-Instruct",

    // Mistral
    "mistralai/Mistral-7B-Instruct-v0.3",
    "mistralai/Mistral-Nemo-Instruct-2407",
    "mistralai/Mixtral-8x7B-Instruct-v0.1",

    // Google
    "google/gemma-2-9b-it",
    "google/gemma-7b-it",

    // Qwen
    "Qwen/Qwen2.5-Coder-7B-Instruct",
    "Qwen/Qwen2.5-7B-Instruct",

    // Microsoft
    "microsoft/Phi-3-mini-4k-instruct",

    // DeepSeek
    "deepseek-ai/deepseek-coder-6.7b-instruct",

    // Tiny fallback (almost always works)
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
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
                  "You are a senior developer. Create a professional GitHub README.md with introduction, features and installation steps. Do not use emojis."
              },
              {
                role: "user",
                content: `Generate a README for: ${repoUrl}`
              }
            ],
            max_tokens: 1000,
            temperature: 0.6
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data?.error) {
        console.warn(`Model ${model} failed`, data?.error || response.status);
        await sleep(500); // avoid rate limits
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
      await sleep(500);
      continue;
    }
  }

  return res.status(503).json({
    error: "All models are busy. Please try again in 20 seconds."
  });
}
