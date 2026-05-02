const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/news', newsController.getNews);
router.post('/analyze', newsController.manualAnalyze);
router.get('/stats', newsController.getStats);
router.post('/fetch-news', newsController.triggerFetchNews);

module.exports = router;
