const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analyzeArticle = async (content) => {
  // If API key is missing or is the placeholder, use fallback extraction
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return fallbackExtraction(content);
  }

  const prompt = `
    Analyze the following news article and extract key business insights.
    Provide the output strictly as a JSON object with the following fields:
    - "company": The primary company mentioned (or an empty string if none).
    - "deal_size": Any mentioned deal size, investment amount, or financial figure (or an empty string).
    - "investor": The primary investor or acquiring company mentioned (or an empty string).
    - "summary": A concise 1-2 sentence summary of the article.
    - "sentiment": One of "positive", "negative", or "neutral".

    Article:
    ${content}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error("AI Analysis error:", error);
    return fallbackExtraction(content);
  }
};

const fallbackExtraction = (content) => {
  // Simple keyword-based extraction for development/fallback
  const companies = ["Apple", "Google", "Microsoft", "Amazon", "Meta", "Tesla", "Nvidia", "OpenAI", "DeepSeek", "SpaceX"];
  let foundCompany = "";
  for (const c of companies) {
    if (content.toLowerCase().includes(c.toLowerCase())) {
      foundCompany = c;
      break;
    }
  }

  const sentiment = content.toLowerCase().includes("down") || content.toLowerCase().includes("loss") || content.toLowerCase().includes("drop") ? "negative" :
                   content.toLowerCase().includes("up") || content.toLowerCase().includes("gain") || content.toLowerCase().includes("profit") || content.toLowerCase().includes("deal") ? "positive" : "neutral";

  return {
    company: foundCompany || "Market",
    deal_size: "",
    investor: "",
    summary: content.substring(0, 150) + "...",
    sentiment: sentiment
  };
};

const processArticlesBatch = async (articles) => {
  const processed = [];
  for (const article of articles) {
    try {
      const analysis = await analyzeArticle(article.content || article.title);
      processed.push({ ...article, ...analysis });
    } catch (e) {
      console.error("Error processing article in batch:", e);
      processed.push({ 
        ...article, 
        company: "Market", 
        deal_size: "", 
        investor: "", 
        summary: article.title, 
        sentiment: "neutral" 
      });
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return processed;
};

module.exports = {
  analyzeArticle,
  processArticlesBatch
};
