
class LazySettings {
  async loadSettings() {
    try {
      // Implement the logic to fetch settings
      const settings = await this.fetchSettings(); // Replace with actual implementation
      return { settings };
    } catch (error) {
      return { message: 'Failed to fetch settings' };
    }
  }

  async fetchSettings() {
    // Implement the logic to fetch settings
    // For demonstration purposes, return a sample settings object
    return { setting1: 'setting1 value', setting2: 'setting2 value' };
  }
}


const chroma_db = {};


async postAideChat(req, res) {
  const { user_query, output_embeddings } = req.body;
  const aideKey = 'your_aide_api_key';
  const aideUrl = 'your_aide_url';
  const openaiClient = axios.create({
    baseURL: aideUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aideKey}`
    }
  });

  const messages = [
    {
      'role': 'system',
      'content': 'You are an expert Developer. Your job is to understand the provided user query and context and give proper relevant code that will be helpful to evaluate my ground truth'
    },
    {
      'role': 'user',
      'content': `The following is the user query : ${user_query} \n The following are the necessary contexts to take into consideration : ${output_embeddings}. `
    }
  ];

  try {
    const response = await openaiClient.post('/v1/chat/completions', {
      model: 'aide',
      messages,
      temperature: 0.1
    });

    const output = response.data.choices[0].message.content;
    res.json({ output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to call aide_chat function' });
  }
}


async getRelevantContext(contextList, userQuery) {
  let totalContext = '';
  let promptWithContext = '';
  for (const item of contextList) {
    promptWithContext += item + '\n';
    const encoding = tiktoken.getEncoding("cl100k_base");
    const tokenLength = encoding.encode(promptWithContext).length;
    if (tokenLength < 3000) {
      totalContext = promptWithContext;
    } else {
      return totalContext;
    }
  }
  return totalContext;
}


async postGeneratePrediction(req, res) {
  try {
    const { validation_json } = req.body;
    const prediction_from_llm = await this.generatePrediction(validation_json);
    res.json(prediction_from_llm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async generatePrediction(validation_json) {
  const context_list = [];
  for (const data of validation_json) {
    try {
      const user_query = data.prompt;
      for (const context_key in data.crossfile_context) {
        if (context_key === 'list') {
          for (const context_item of data.crossfile_context[context_key]) {
            context_list.push(context_item.retrieved_chunk);
          }
        }
      }

      const output_embeddings = await this.getRelevantContext(context_list, user_query);
      const prediction_from_llm = await this.aideChat(user_query, output_embeddings);
      data.pred = prediction_from_llm;
      jsonfile.writeFileSync('testing.json', validation_json);
    } catch (error) {
      console.error(error);
    }
  }
  jsonfile.writeFileSync('validation.json', validation_json);
  return validation_json;
}
