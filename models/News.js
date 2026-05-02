const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: true },
  publishedAt: { type: Date, required: true },

  // AI Extracted fields
  company: { type: String, default: "" },
  deal_size: { type: String, default: "" },
  investor: { type: String, default: "" },
  summary: { type: String, default: "" },
  sentiment: { 
    type: String, 
    enum: ["positive", "negative", "neutral", ""],
    default: "" 
  },

  hash: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
