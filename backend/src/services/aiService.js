const axios = require('axios');

class AIService {
  constructor() {
    // Using OpenAI's free tier API (you'll need to set up an API key)
    // Alternative: Use Hugging Face's free inference API
    this.apiKey = process.env.OPENAI_API_KEY || process.env.HUGGINGFACE_API_KEY;
    this.baseURL = process.env.AI_API_URL || 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo';
  }

  async summarizeText(text) {
    try {
      if (!this.apiKey) {
        // Fallback to a simple summarization if no API key is available
        return this.simpleSummarize(text);
      }

      const prompt = `Please provide a concise summary of the following text. Focus on the key concepts and main ideas:\n\n${text}\n\nSummary:`;

      if (this.baseURL.includes('openai')) {
        return await this.summarizeWithOpenAI(prompt);
      } else {
        return await this.summarizeWithHuggingFace(prompt);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to simple summarization
      return this.simpleSummarize(text);
    }
  }

  async summarizeWithOpenAI(prompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate summary with OpenAI');
    }
  }

  async summarizeWithHuggingFace(prompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/facebook/bart-large-cnn`,
        {
          inputs: prompt,
          parameters: {
            max_length: 150,
            min_length: 30,
            do_sample: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0].summary_text.trim();
    } catch (error) {
      console.error('Hugging Face API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate summary with Hugging Face');
    }
  }

  simpleSummarize(text) {
    // Simple fallback summarization
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return 'No content to summarize.';
    }

    if (sentences.length <= 3) {
      return sentences.join('. ').trim() + '.';
    }

    // Take first and last sentences, plus one from the middle
    const firstSentence = sentences[0].trim();
    const middleIndex = Math.floor(sentences.length / 2);
    const middleSentence = sentences[middleIndex].trim();
    const lastSentence = sentences[sentences.length - 1].trim();

    return `${firstSentence}. ${middleSentence}. ${lastSentence}.`;
  }

  async validateApiKey() {
    if (!this.apiKey) {
      return false;
    }

    try {
      if (this.baseURL.includes('openai')) {
        const response = await axios.get(`${this.baseURL}/models`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        return response.status === 200;
      } else {
        // For Hugging Face, we can make a simple test request
        return true; // Simplified for now
      }
    } catch (error) {
      console.error('API Key validation failed:', error.message);
      return false;
    }
  }
}

module.exports = new AIService();
