
// Retrieve the OpenAI API key from environment variables
const openAIApiKey = process.env.OPENAI_API_KEY;


class ChatBotView {
  constructor() {
    this.getBotMessageStream = this.getBotMessageStream.bind(this);
  }

  /**
   * POST /get-bot-message-stream
   * 
   * @description Retrieves the bot message stream
   * @param {string} user_message - The user message
   * @returns {string} The bot message
   */
  async getBotMessageStream(req, res) {
    // TO DO: Implement the logic to retrieve the bot message stream
    const userMessage = req.body.user_message;
    const openaiApiKey = 'TO DO: Implement the logic to retrieve the OpenAI API key'; // Replace with actual API key
    const openai = require('openai');
    openai.apiKey = openaiApiKey;

    const response = await openai.chat.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      stream: true
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    response.on('data', (chunk) => {
      const chatCompletionDelta = chunk.choices[0].delta;
      const jsonResponse = JSON.stringify(chatCompletionDelta);
      res.write(`data: ${jsonResponse}\n\n`);
    });

    response.on('end', () => {
      res.end();
    });
  }
}
