const crypto = require('crypto');
const News = require('../models/News');

const generateHash = (title, source) => {
  return crypto.createHash('sha256').update(`${title}-${source}`).digest('hex');
};

const isDuplicate = async (hash) => {
  const existingNews = await News.findOne({ hash });
  return !!existingNews;
};

module.exports = {
  generateHash,
  isDuplicate
};
