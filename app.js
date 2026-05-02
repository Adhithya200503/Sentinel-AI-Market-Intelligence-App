require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const newsRoutes = require('./routes/newsRoutes');
require('./jobs/cronJobs'); // Start cron jobs

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', newsRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sentinel';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      // Trigger initial ingestion in development
      if (process.env.NODE_ENV !== 'production') {
        const { runIngestionPipeline } = require('./jobs/cronJobs');
        runIngestionPipeline();
      }
    });

  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
