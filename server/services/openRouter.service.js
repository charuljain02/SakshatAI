import axios from "axios";

export const askAi = async (messages) => {

  try {

    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      throw new Error("Messages array is empty");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY missing");
    }

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "deepseek/deepseek-chat-v3-0324",

        messages,

        temperature: 0.7,

        max_tokens: 1000
      },

      {
        headers: {

          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",

          "HTTP-Referer": "https://sakshatai-client.onrender.com",

          "X-Title": "SakshatAI"
        },

        timeout: 60000
      }
    );

    console.log(
      "OPENROUTER RESPONSE:",
      response.data
    );

    const content =
      response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response");
    }

    return content;

  } catch (error) {

    console.error(
      "OPENROUTER FULL ERROR:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
      error.message ||
      "OpenRouter API Error"
    );
  }
};
