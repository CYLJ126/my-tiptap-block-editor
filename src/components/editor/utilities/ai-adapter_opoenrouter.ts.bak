import {createOpenRouter} from '@openrouter/ai-sdk-provider';
import { streamText } from "ai";

export default async function generateAiResponse({ prompt }: { prompt: string; }) {
  // const apiKey = import.meta.env.DEEPSEEK_API_KEY;
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  console.log('meta.env: ', import.meta.env);
  if (!apiKey) {
    throw Error("Require OpenRouter api key");
  }

  const openRouter = createOpenRouter({
    apiKey: apiKey,
  });

  const result = streamText({
    model: openRouter.completion('google/gemini-3-flash-preview'),
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
