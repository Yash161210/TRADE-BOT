# Yash AI - NSE Stock Trading Intelligence Assistant

A self-learning AI chatbot for NSE (National Stock Exchange) stock trading analysis.

## Features

- 🤖 **AI-Powered Chatbot** - Conversational interface using Euron API
- 📊 **NSE Stock Analysis** - Real-time insights for Indian stock market
- 📈 **TradingView Integration** - Analyzes trading chat data
- 📁 **File Upload** - Learn from PDF, CSV, TXT, images, and videos
- 🧠 **Self-Learning** - Adapts based on user feedback
- 🌐 **Multi-language** - Supports English, Hindi, and Hinglish

## Deployment on Render

This app is configured to deploy on Render automatically.

### Steps to Deploy:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the settings from `render.yaml`
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)

3. **Your app will be live at:**
   - `https://yash-nse-trading-ai.onrender.com` (or your custom domain)

## Local Development

```bash
# Install dependencies
npm install

# Run server
npm start

# Open http://localhost:3000
```

## Configuration

The API key is hardcoded in `yash_nft_ai.html`. For production, consider moving it to environment variables.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Hosting: Render
- AI: Euron API

