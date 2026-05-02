const cron = require('node-cron');
const { fetchNewsFromFeeds } = require('../services/newsService');
const { processArticlesBatch } = require('../services/aiService');
const { generateHash, isDuplicate } = require('../services/dedupService');
const News = require('../models/News');

const runIngestionPipeline = async () => {
  console.log('--- Starting Scheduled News Ingestion Pipeline ---');
  try {
    const rawArticles = await fetchNewsFromFeeds();
    const newArticles = [];

    // Deduplication step
    for (const article of rawArticles) {
      const hash = generateHash(article.title, article.source);
      const isDup = await isDuplicate(hash);
      if (!isDup) {
        newArticles.push({ ...article, hash });
      }
    }

    console.log(`Found ${newArticles.length} new articles to process.`);

    if (newArticles.length > 0) {
      const processedArticles = await processArticlesBatch(newArticles);
      await News.insertMany(processedArticles);
      console.log(`Successfully ingested and processed ${processedArticles.length} articles.`);
    }
  } catch (error) {
    console.error('Error during scheduled news ingestion:', error);
  }
  console.log('--- Finished Scheduled News Ingestion Pipeline ---');
};

// Run every 30 minutes
cron.schedule('*/30 * * * *', () => {
  runIngestionPipeline();
});

module.exports = {
  runIngestionPipeline
};
