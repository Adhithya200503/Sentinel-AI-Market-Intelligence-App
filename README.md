# The Sentinel - Backend Intelligence Engine

This is the backend server for **The Sentinel**, an autonomous market intelligence application that monitors tech and business news, processes it using AI, and provides actionable insights.

## Features

- **Automated Ingestion**: Scheduled cron jobs fetch the latest news from curated RSS feeds (TechCrunch, WSJ, CNBC).
- **AI-Powered Analysis**: Integrates with Google Gemini (via `@google/genai`) to extract mentioned companies, deal sizes, investors, and sentiment.
- **Smart Deduplication**: Uses SHA-256 hashing to ensure news articles aren't processed twice.
- **RESTful API**: Clean endpoints for the dashboard to consume stats and news feeds.
- **Development Fallback**: Includes a keyword-based fallback system to provide insights even without an active AI API key.

## Tech Stack

- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Persistent storage for articles and insights.
- **Node-Cron**: Task scheduling for ingestion.
- **Google Gemini API**: Advanced LLM for news processing.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Gemini API Key (Optional, fallback provided)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sentinel
   GEMINI_API_KEY=your_actual_key_here
   ```

3. Start the server:
   ```bash
   node app.js
   ```

## API Reference

### News
- `GET /api/news`: Get all processed articles. Supports query params: `search`, `company`, `sentiment`.
- `POST /api/fetch-news`: Manually trigger the ingestion pipeline.

### Analytics
- `GET /api/stats`: Get dashboard statistics (total counts, top companies, sentiment breakdown).
- `POST /api/analyze`: Analyze a raw block of text using the AI engine.

### Utility
- `GET /health`: Check server status.

## Project Structure

- `/controllers`: Request handlers for the API.
- `/jobs`: Cron job definitions.
- `/models`: Mongoose schemas.
- `/routes`: Express route definitions.
- `/services`: Core logic (AI processing, news fetching, deduplication).
