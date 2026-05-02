const Parser = require('rss-parser');
const parser = new Parser();

// Default tech and business feeds
const RSS_FEEDS = [
  'https://techcrunch.com/feed/',
  'https://feeds.a.dj.com/rss/RSSWSJD.xml', // WSJ Tech
  'https://www.cnbc.com/id/100003114/device/rss/rss.html', // CNBC Top News
];

const fetchNewsFromFeeds = async () => {
  let allArticles = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.slice(0, 10); // Get top 10 from each feed to prevent overload
      
      const formattedItems = items.map(item => ({
        title: item.title,
        content: item.contentSnippet || item.content || item.title,
        source: feed.title || 'Unknown Source',
        url: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      }));

      allArticles = [...allArticles, ...formattedItems];
    } catch (error) {
      console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    }
  }

  return allArticles;
};

module.exports = {
  fetchNewsFromFeeds
};
