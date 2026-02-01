const express = require('express');
const router = express.Router();
const { generateBookSummary } = require('../services/anthropic');

router.post('/summarize', async (req, res) => {
  try {
    const { title, author } = req.body;

    // Validate input
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Both book title and author name are required.'
      });
    }

    if (title.trim().length === 0 || author.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Book title and author name cannot be empty.'
      });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_new_api_key_here') {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Anthropic API key is not configured.'
      });
    }

    // Generate summary
    const result = await generateBookSummary(title.trim(), author.trim());

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Construct Amazon affiliate URL
    const affiliateTag = process.env.AMAZON_AFFILIATE_TAG || 'thinkingroc0e-20';
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(title.trim() + ' ' + author.trim())}&tag=${affiliateTag}`;

    res.json({
      success: true,
      summary: result.summary,
      amazonUrl
    });

  } catch (error) {
    console.error('Summarize route error:', error);

    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        error: 'This is taking longer than expected. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Could not generate summary. Please try again.'
    });
  }
});

module.exports = router;
