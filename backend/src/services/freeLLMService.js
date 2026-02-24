const axios = require('axios');

class HuggingFaceService {
  constructor() {
    // Hugging Face API configuration
    this.baseUrl = process.env.AI_API_URL || 'https://api.inference.huggingface.co';
    this.model = process.env.AI_MODEL || 'facebook/bart-large-cnn';
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.available = false;
    
    this.initializeProvider();
  }

  async initializeProvider() {
    // Check if Hugging Face is available
    await this.checkHuggingFace();
  }

  async checkHuggingFace() {
    if (this.apiKey) {
      this.available = true;
      console.log('✅ Hugging Face provider available');
    } else {
      console.log('❌ Hugging Face provider not available (no API key)');
    }
  }

  async summarizeText(text, maxLength = 500) {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for summarization');
    }

    if (!this.available) {
      throw new Error('Hugging Face service is not available');
    }

    try {
      console.log('Attempting summarization with Hugging Face...');
      const summary = await this.summarizeWithHuggingFace(text, maxLength);
      console.log('✅ Successfully summarized with Hugging Face');
      return summary;
    } catch (error) {
      console.log(`❌ Failed with Hugging Face: ${error.message}`);
      // Return fallback summary
      return this.generateFallbackSummary(text, maxLength);
    }
  }

  async summarizeWithHuggingFace(text, maxLength) {
    const response = await axios.post(
      `${this.baseUrl}/models/${this.model}/summarization`,
      {
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 50,
          do_sample: false,
          early_stopping: true,
          num_beams: 3,
          temperature: 0.7,
          top_k: 50,
          top_p: 0.95,
          no_repeat_ngram_size: 2
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text.trim();
    } else {
      throw new Error('Invalid response from Hugging Face');
    }
  }

  generateFallbackSummary(text, maxLength = 500) {
    // Simple fallback summarization logic
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = text.trim().split(/\s+/).length;
    
    if (wordCount <= maxLength) {
      return text.substring(0, maxLength * 10).trim() + (text.length > maxLength * 10 ? '...' : '');
    }
    
    // Extract key sentences based on length and position
    const keySentences = sentences
      .filter(sentence => sentence.trim().length > 0)
      .slice(0, Math.min(5, Math.ceil(sentences.length * 0.3)))
      .join('. ');
    
    const summary = keySentences.substring(0, maxLength * 8).trim();
    
    return summary + (summary !== text ? '...' : '');
  }

  async testConnection() {
    return {
      success: true,
      provider: 'huggingface',
      available: this.available,
      model: this.model,
      baseUrl: this.baseUrl,
      apiKey: this.apiKey ? 'configured' : 'not configured'
    };
  }

  isConfigured() {
    return this.available;
  }

  // Advanced summarization methods
  async summarizeWithBulletPoints(text) {
    const prompt = `Please provide a bullet-point summary of the following text. Focus on the main concepts and key information:\n\n${text}`;
    
    try {
      const summary = await this.summarizeWithHuggingFace(text, 300);
      // Convert to bullet points
      const bulletPoints = summary
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 0)
        .map(s => `• ${s.trim()}`)
        .join('\n');
      return bulletPoints;
    } catch (error) {
      // Fallback: extract bullet points
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      return sentences.slice(0, 3).map((s, i) => `• ${s.trim()}`).join('\n');
    }
  }

  async extractKeyConcepts(text) {
    const prompt = `Extract the key concepts and main topics from the following text. Return them as a comma-separated list:\n\n${text}`;
    
    try {
      const concepts = await this.summarizeWithHuggingFace(text, 100);
      return concepts.split(',').map(c => c.trim()).filter(c => c.length > 0);
    } catch (error) {
      // Fallback: extract words that appear frequently
      const words = text.toLowerCase().split(/\W+/);
      const wordCount = {};
      
      words.forEach(word => {
        if (word.length > 3) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
      
      return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
    }
  }

  async generateStudyQuestions(text, count = 5) {
    const prompt = `Generate ${count} study questions based on the following text. Make them thought-provoking and suitable for self-assessment:\n\n${text}`;
    
    try {
      const questions = await this.summarizeWithHuggingFace(text, 200);
      return questions
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 0)
        .slice(0, count)
        .map((q, i) => `${i + 1}. ${q.trim()}?`);
    } catch (error) {
      // Fallback questions
      return [
        '1. What are the main concepts discussed in this text?',
        '2. How would you explain this content to someone else?',
        '3. What are the practical applications of this information?',
        '4. What questions do you still have after reading this?',
        '5. How does this relate to what you already know?'
      ];
    }
  }

  // Batch processing for multiple notes
  async batchSummarize(notes, type = 'standard', maxLength = 500) {
    const results = [];
    const errors = [];
    
    for (const note of notes) {
      try {
        let summaryText;
        switch (type) {
          case 'bullet-points':
            summaryText = await this.summarizeWithBulletPoints(note.content);
            break;
          case 'concepts':
            const concepts = await this.extractKeyConcepts(note.content);
            summaryText = `Key Concepts: ${concepts.join(', ')}`;
            break;
          case 'questions':
            const questions = await this.generateStudyQuestions(note.content);
            summaryText = `Study Questions:\n${questions.join('\n')}`;
            break;
          default:
            summaryText = await this.summarizeText(note.content, maxLength);
        }
        
        results.push({
          note_id: note.id,
          summary: summaryText,
          success: true
        });
      } catch (error) {
        errors.push({ note_id: note.id, error: error.message });
      }
    }

    return {
      successful: results,
      failed: errors,
      total_processed: notes.length,
      success_rate: (results.length / notes.length * 100).toFixed(1) + '%'
    };
  }
}

module.exports = new HuggingFaceService();
