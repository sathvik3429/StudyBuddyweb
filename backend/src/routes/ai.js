const express = require('express');
const router = express.Router();

// AI Summarization endpoint
router.post('/summarize', async (req, res) => {
  try {
    const { text, max_length = 150, min_length = 30 } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    // Try Hugging Face API from backend (no CORS issues)
    try {
      const huggingFaceToken = process.env.HUGGINGFACE_API_KEY;
      
      if (!huggingFaceToken) {
        console.log('Hugging Face API key not found, using smart summarization');
        throw new Error('No API key');
      }

      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: max_length,
            min_length: min_length,
            do_sample: false,
            early_stopping: true,
            num_beams: 4,
            temperature: 1.0,
            length_penalty: 2.0,
            repetition_penalty: 1.0
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result[0] && result[0].summary_text) {
          return res.json({
            success: true,
            summary: result[0].summary_text,
            model: 'facebook/bart-large-cnn'
          });
        }
      }
    } catch (apiError) {
      console.log('Hugging Face API failed, using smart summarization');
    }

    // Fallback to smart summarization
    const smartSummary = generateSmartSummary(text);
    
    res.json({
      success: true,
      summary: smartSummary,
      model: 'smart-summarizer',
      fallback: true
    });

  } catch (error) {
    console.error('AI Summarization Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary'
    });
  }
});

// Smart summarization helper function
function generateSmartSummary(text) {
  if (!text) return 'No content to summarize.';
  
  // Clean the text first
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  
  if (words.length <= 30) {
    return cleanText;
  }
  
  // Extract key sentences using simple heuristics
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) {
    return cleanText.substring(0, 100) + '...';
  }
  
  // Score sentences based on length and position
  const scoredSentences = sentences.map((sentence, index) => {
    const sentenceWords = sentence.trim().split(' ');
    const lengthScore = sentenceWords.length >= 10 && sentenceWords.length <= 25 ? 1 : 0.5;
    const positionScore = index === 0 || index === sentences.length - 1 ? 0.8 : 0.6;
    
    return {
      sentence: sentence.trim(),
      score: lengthScore + positionScore
    };
  });
  
  // Sort by score and take top sentences
  scoredSentences.sort((a, b) => b.score - a.score);
  const topSentences = scoredSentences.slice(0, Math.min(3, sentences.length));
  
  // Create summary
  let summary = topSentences.map(s => s.sentence).join('. ');
  
  // Ensure it's not too long
  if (summary.length > 150) {
    summary = summary.substring(0, 147) + '...';
  }
  
  return summary + (summary.endsWith('.') ? '' : '.');
}

module.exports = router;
