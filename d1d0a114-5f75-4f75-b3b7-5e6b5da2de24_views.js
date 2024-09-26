
// Fetch the OpenAI API key from the environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;

// If the OpenAI API key is not found, return a 400 response
if (!openaiApiKey) {
  return response.status(400).send({ message: 'OpenAI API key not found' });
}

// Return the OpenAI API key in the response
return response.status(200).send({ openai_api_key: openaiApiKey });


async getBotMessageStream(self, request, response) {
  // Set the OpenAI API key
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // Create a new chat completion
  const chatCompletionUrl = 'https://api.openai.com/v1/chat/completions';
  const chatCompletionHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`,
  };
  const chatCompletionData = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: request.body.message,
      },
    ],
    stream: true,
  };

  // Make a POST request to the OpenAI API
  const axiosResponse = await axios.post(chatCompletionUrl, chatCompletionData, {
    headers: chatCompletionHeaders,
  });

  // Process the response from the OpenAI API
  const chatCompletionDelta = axiosResponse.data.choices[0].delta;
  const jsonContent = JSON.stringify(chatCompletionDelta.content);

  // Return the response as a stream
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });
  response.write(`data: ${jsonContent}\n\n`);
  response.end();
}
