
// Define the OpenAI API Key handler class
class OpenAI_API_Key_Handler {
  /**
   * GET handler for retrieving the OpenAI API key
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getOpenAI_API_Key(req, res) {
    // Retrieve the OpenAI API key from the environment variables
    const openai_api_key = process.env.OPENAI_API_KEY;

    // Check if the OpenAI API key exists
    if (openai_api_key) {
      // Return the OpenAI API key as a JSON response
      res.json({ openai_api_key });
    } else {
      // Return a 404 error if the OpenAI API key does not exist
      res.status(404).json({ error: 'OpenAI API key not found' });
    }
  }
}


class ChatBotView {
  /**
   * POST handler for generating a chat completion
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async postChatCompletion(req, res) {
    const openai_api_key = req.body.openai_api_key;
    const user_message = req.body.user_message;
    const model = 'gpt-3.5-turbo';
    const messages = [
      { role: 'user', content: user_message }
    ];

    openai.apiKey = openai_api_key;
    const response = await openai.chat.completions.create({
      model,
      messages,
      stream: false
    });

    const chatCompletionDelta = response.choices[0].delta;
    const jsonResponse = JSON.stringify(chatCompletionDelta);
    res.json(JSON.parse(jsonResponse));
  }
}
