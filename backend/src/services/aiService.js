const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo';
  }

  async summarizeText(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('No text provided for summarization');
      }

      // If no API key, return a simple fallback summary
      if (!this.apiKey) {
        return this.generateFallbackSummary(text);
      }

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise, accurate summaries of educational content. Focus on key concepts, main ideas, and important details.'
            },
            {
              role: 'user',
              content: `Please provide a comprehensive summary of the following text:\n\n${text}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const summary = response.data.choices[0]?.message?.content || 'Unable to generate summary';
      return summary.trim();
    } catch (error) {
      console.error('AI Service Error:', error.message);
      
      // Fallback to simple summary if AI service fails
      return this.generateFallbackSummary(text);
    }
  }

  generateFallbackSummary(text) {
    // Simple fallback summarization logic
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const wordCount = text.split(' ').length;
    
    if (wordCount <= 100) {
      return text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }
    
    // Take first few sentences for summary
    const summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
    const summary = sentences.slice(0, summaryLength).join('.').trim();
    
    return summary + (summary !== text ? '...' : '');
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async testConnection() {
    try {
      if (!this.apiKey) {
        return { success: false, error: 'No API key configured' };
      }

      const response = await axios.get(`${this.apiUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 5000
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }
}

module.exports = new AIService();
