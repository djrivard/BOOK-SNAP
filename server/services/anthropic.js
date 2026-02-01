const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a book summary expert. When given a book title and author, you will:

1. Use web search to find accurate, current information about the book
2. Generate a comprehensive, structured summary based on real information about the book
3. Return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON)

IMPORTANT:
- Use web search to verify the book exists and get accurate information
- If you cannot find the book or it doesn't appear to exist, return: {"error": "Book not found"}
- Do NOT make up or hallucinate information about books
- Return ONLY the JSON object, nothing else

The JSON response must follow this exact structure:
{
  "bookTitle": "Full title of the book",
  "author": "Author's full name",
  "publishYear": "Year published (e.g., '2018')",
  "genre": "Genre/category (e.g., 'Self-Help / Personal Development')",
  "briefDescription": "A 2-3 sentence elevator pitch of what the book is about",
  "mainPoints": [
    {
      "title": "Short title for this key point",
      "description": "2-4 sentence explanation of this key point or theme"
    }
  ],
  "callToAction": "The book's core message — what the author wants the reader to DO or CHANGE after reading",
  "conclusion": "A 3-5 sentence summary of the book's conclusion and lasting message",
  "targetAudience": "Who this book is best suited for",
  "notableQuote": "One well-known or representative quote from the book (if available, otherwise use an empty string)"
}

Generate 5-8 main points per book. Be thorough but concise.`;

// Helper function to strip citation tags from text
function stripCitations(text) {
  if (typeof text !== 'string') return text;
  // Remove <cite index="...">...</cite> tags but keep the content inside
  return text
    .replace(/<cite[^>]*>/gi, '')
    .replace(/<\/cite>/gi, '')
    .trim();
}

// Recursively strip citations from all string values in an object
function stripCitationsFromObject(obj) {
  if (typeof obj === 'string') {
    return stripCitations(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => stripCitationsFromObject(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = stripCitationsFromObject(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

async function generateBookSummary(title, author) {
  try {
    let messages = [
      {
        role: 'user',
        content: `Please search for and summarize the book "${title}" by ${author}. Use web search to find accurate information about this book, then provide a comprehensive summary in the specified JSON format.`
      }
    ];

    let response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
        }
      ],
      system: SYSTEM_PROMPT,
      messages
    });

    // Handle tool use loop - Claude may need multiple turns to complete web search
    let iterations = 0;
    const maxIterations = 10;

    while (response.stop_reason === 'tool_use' && iterations < maxIterations) {
      iterations++;

      // Add assistant's response to messages
      messages.push({
        role: 'assistant',
        content: response.content
      });

      // Process tool results - for web_search, the results are handled automatically
      // We just need to continue the conversation
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

      // Add tool results (web search results are injected automatically by the API)
      const toolResults = toolUseBlocks.map(toolUse => ({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: 'Search completed'
      }));

      messages.push({
        role: 'user',
        content: toolResults
      });

      // Make the next request
      response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
          }
        ],
        system: SYSTEM_PROMPT,
        messages
      });
    }

    // Extract the text content from the final response
    let textContent = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text;
      }
    }

    console.log('Final response stop_reason:', response.stop_reason);
    console.log('Text content length:', textContent.length);

    if (!textContent) {
      return {
        success: false,
        error: 'Could not generate summary. Please try again.'
      };
    }

    // Parse the JSON response
    let summary;
    try {
      let jsonStr = textContent.trim();

      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/^```json\s*/i, '');
      jsonStr = jsonStr.replace(/^```\s*/i, '');
      jsonStr = jsonStr.replace(/\s*```$/i, '');
      jsonStr = jsonStr.trim();

      // Try to find JSON object in the response if there's extra text
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      summary = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', textContent);

      // Try one more time with a more aggressive approach
      try {
        const jsonMatch = textContent.match(/\{[\s\S]*"bookTitle"[\s\S]*\}/);
        if (jsonMatch) {
          summary = JSON.parse(jsonMatch[0]);
        } else {
          return {
            success: false,
            error: 'Could not process the book summary. Please try again.'
          };
        }
      } catch (retryError) {
        return {
          success: false,
          error: 'Could not process the book summary. Please try again.'
        };
      }
    }

    // Check if the book was not found
    if (summary.error === 'Book not found') {
      return {
        success: false,
        error: "We couldn't find that book. Please double-check the title and author name."
      };
    }

    // Validate required fields
    const requiredFields = ['bookTitle', 'author', 'briefDescription', 'mainPoints', 'callToAction', 'conclusion'];
    for (const field of requiredFields) {
      if (!summary[field]) {
        return {
          success: false,
          error: 'Could not generate a complete summary. Please try again.'
        };
      }
    }

    // Ensure mainPoints is an array with content
    if (!Array.isArray(summary.mainPoints) || summary.mainPoints.length === 0) {
      return {
        success: false,
        error: 'Could not generate a complete summary. Please try again.'
      };
    }

    // Strip citation tags from all text fields
    const cleanedSummary = stripCitationsFromObject(summary);

    return {
      success: true,
      summary: cleanedSummary
    };

  } catch (error) {
    console.error('Anthropic API error:', error);

    if (error.status === 401) {
      return {
        success: false,
        error: 'API authentication failed. Please check the API key configuration.'
      };
    }

    if (error.status === 429) {
      return {
        success: false,
        error: 'Too many requests to the AI service. Please wait a moment and try again.'
      };
    }

    throw error;
  }
}

module.exports = { generateBookSummary };
