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

### API Keys
- **Euron AI API**: Hardcoded in `yash_nft_ai.html`. For production, consider moving to environment variables.
- **TradingView OAuth**: For production use, register your app at [TradingView Widget Docs](https://www.tradingview.com/widget-docs/) and set environment variables:
  - `TRADINGVIEW_CLIENT_ID`
  - `TRADINGVIEW_CLIENT_SECRET`
  - `TRADINGVIEW_REDIRECT_URI`

### TradingView Integration
The app includes TradingView OAuth login functionality. To enable it:
1. Register your application with TradingView
2. Set the environment variables above
3. Update the OAuth URLs in `yash_nft_ai.html` if needed
4. The app will securely store tokens in sessions (no passwords stored)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Hosting: Render
- AI: Euron API

