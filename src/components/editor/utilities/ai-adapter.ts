import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText } from "ai";

export default async function generateAiResponse({ prompt }: { prompt: string; }) {
  // const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  console.log('meta.env: ', import.meta.env);
  if (!apiKey) {
    throw Error("Require deepseek api key");
  }

    const deepseek = createDeepSeek({
        apiKey: apiKey,
    });

  const result = streamText({
    model: deepseek.chat('deepseek-v4-pro'),
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
