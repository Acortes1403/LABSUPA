const AI_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

export class AIService {
  constructor(endpoint = AI_ENDPOINT, apiKey = API_KEY) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async sendMessage(message, options = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers
        },
        body: JSON.stringify({
          model: options.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          ...options.body
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  async streamMessage(message, onChunk, options = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: true,
          ...options.body
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        const value = result.value;
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') return;

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      throw new Error(`Stream error: ${error.message}`);
    }
  }
}

export const aiService = new AIService();