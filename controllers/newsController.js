const News = require('../models/News');
const { analyzeArticle } = require('../services/aiService');
const { runIngestionPipeline } = require('../jobs/cronJobs');

// GET /api/news
const getNews = async (req, res) => {
  try {
    const { company, sentiment, search } = req.query;
    
    let query = {};
    if (company) query.company = new RegExp(company, 'i');
    if (sentiment) query.sentiment = sentiment;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
      ];
    }

    const news = await News.find(query).sort({ publishedAt: -1 }).limit(50);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST /api/analyze
const manualAnalyze = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const analysis = await analyzeArticle(text);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
};

// GET /api/stats
const getStats = async (req, res) => {
  try {
    const totalArticles = await News.countDocuments();
    
    const sentimentCounts = await News.aggregate([
      { $group: { _id: "$sentiment", count: { $sum: 1 } } }
    ]);

    const topCompanies = await News.aggregate([
      { $match: { company: { $ne: "" } } },
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalArticles,
      sentimentCounts,
      topCompanies
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// POST /api/fetch-news
const triggerFetchNews = async (req, res) => {
  try {
    // Run asynchronously, don't wait for completion to avoid timeout
    runIngestionPipeline();
    res.json({ message: 'Ingestion pipeline triggered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger pipeline' });
  }
};

module.exports = {
  getNews,
  manualAnalyze,
  getStats,
  triggerFetchNews
};
