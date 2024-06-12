import { Configuration } from "openai";

export const configureOpenAi = () => {
  // Set up the OpenAI API
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPEN_AI_ORGANISATION,
  });
  return config;
}
