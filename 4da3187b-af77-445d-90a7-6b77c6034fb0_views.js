
// openai-api-key.controller.js
const express = require('express');
const router = express.Router();

class OPENAI_API_KEYController {
    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    get(req, res) {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OPENAI_API_KEY not set' });
        }
        return res.json({ OPENAI_API_KEY });
    }

    post(req, res) {
        // implementation for POST method
        // For now, just return a success response
        return res.json({ message: 'POST request received' });
    }
}

module.exports = {
    OPENAI_API_KEYController,
};


// chat-bot.controller.js
class ChatBotView {
    constructor() {
        this.getBotMessageStream = this.getBotMessageStream.bind(this);
        this.post = this.post.bind(this);
    }

    async getBotMessageStream(req, res) {
        const userMessage = req.query.message;
        const openaiApiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key
        const model = 'gpt-3.5-turbo';
        const messages = [{ role: 'user', content: userMessage }];

        try {
            const response = await axios.post(`https://api.openai.com/v1/chat/completions`, {
                model,
                messages,
                stream: true,
            }, {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            for await (const chunk of response.data) {
                const chatCompletionDelta = chunk.choices[0].delta;
                const jsonResponse = chatCompletionDelta;
                if (jsonResponse.content !== "") {
                    res.write(`data: ${JSON.stringify(jsonResponse.content)}\n\n`);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            res.end();
        }
    }

    post(req, res) {
        const request_data = JSON.parse(req.body);
        const userMessage = request_data.message;
        const botMessageStream = this.getBotMessageStream(req, res);
    }
}

module.exports = {
    ChatBotView,
};
