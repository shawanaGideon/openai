import { Response, Request, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAi } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const generatedChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunction" });
    }

    // Grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Send all chats with new one to OpenAI API
    const config = configureOpenAi();
    const openai = new OpenAIApi(config);

    // Get response from OpenAI
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    const aiMessage = chatResponse.data.choices[0]?.message;

    if (aiMessage) {
      user.chats.push(aiMessage);
      await user.save();

      res.status(200).json({ message: aiMessage });
    } else {
      res.status(500).json({ message: "Failed to get a valid response from OpenAI" });
    }

  } catch (error) {
    console.error('Error generating chat completion:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
