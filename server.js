require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.EURON_API_KEY;
const ALLOWED_ORIGIN = 'https://trade-bot-86gm.onrender.com';
const CORRECT_PASSWORD = 'Yash1979161210';

if (!API_KEY) {
    // Do not log secrets; minimal notice for ops
    console.error('EURON_API_KEY is missing. Set it in .env.');
}

// Middleware
app.use(cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'yash-ai-secret-key-2024-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    name: 'yash-ai-session'
}));

// Serve static files
app.use(express.static(__dirname));

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session.authenticated) return next();
    return res.redirect('/login');
}

// Login page
app.get('/login', (req, res) => {
    if (req.session.authenticated) return res.redirect('/');
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login - Yash AI</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px;}.login-container{background:rgba(255,255,255,0.1);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:20px;border:1px solid rgba(255,255,255,0.2);box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);padding:40px;max-width:400px;width:100%;}.login-header{text-align:center;margin-bottom:30px;}.login-header h1{color:white;font-size:28px;margin-bottom:10px;}.login-header p{color:rgba(255,255,255,0.8);font-size:14px;}.form-group{margin-bottom:20px;}.form-group label{display:block;color:white;margin-bottom:8px;font-size:14px;font-weight:500;}.form-group input{width:100%;padding:12px 16px;border:1px solid rgba(255,255,255,0.3);border-radius:10px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);color:white;font-size:16px;outline:none;transition:all 0.3s;}.form-group input::placeholder{color:rgba(255,255,255,0.6);}.form-group input:focus{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.5);}.error-message{background:rgba(244,67,54,0.3);color:white;padding:12px;border-radius:8px;margin-bottom:20px;font-size:14px;display:none;}.error-message.show{display:block;}.login-btn{width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s;}.login-btn:hover{transform:translateY(-2px);box-shadow:0 4px 15px rgba(102,126,234,0.4);}.login-btn:active{transform:translateY(0);}</style></head><body><div class="login-container"><div class="login-header"><h1>🔒 Yash AI</h1><p>NSE Trading Intelligence Assistant</p></div><div class="error-message" id="errorMessage">Invalid password. Please try again.</div><form action="/login" method="POST" id="loginForm"><div class="form-group"><label for="password">Enter Password</label><input type="password" id="password" name="password" placeholder="Enter access password" required autofocus></div><button type="submit" class="login-btn">Access Application</button></form></div><script>const urlParams=new URLSearchParams(window.location.search);if(urlParams.get('error')==='1'){document.getElementById('errorMessage').classList.add('show');}document.getElementById('loginForm').addEventListener('submit',function(e){const password=document.getElementById('password').value;if(!password){e.preventDefault();document.getElementById('errorMessage').classList.add('show');}});</script></body></html>`);
});

// Handle login
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === CORRECT_PASSWORD) {
        req.session.authenticated = true;
        return res.redirect('/');
    }
    return res.redirect('/login?error=1');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

// Serve app
app.get('/', requireAuth, (req, res) => {
    const htmlPath = path.join(__dirname, 'yash_nft_ai.html');
    if (!fs.existsSync(htmlPath)) return res.status(500).send('Application file not found');
    return res.sendFile(htmlPath);
});

// TradingView placeholders (simulated)
app.get('/tradingview/callback', requireAuth, (req, res) => {
    const code = req.query.code;
    const error = req.query.error;
    if (error) {
        return res.send(`<html><body><h2>Authentication Failed</h2><p>Error: ${error}</p><script>window.opener.postMessage({error:'${error}'},'*');window.close();</script></body></html>`);
    }
    if (code) {
        req.session.tradingViewCode = code;
        return res.send(`<html><body><h2>Authentication Successful</h2><p>Processing your login...</p><script>window.opener.postMessage({code:'${code}'},'*');setTimeout(()=>window.close(),1000);</script></body></html>`);
    }
    return res.status(400).send('No authorization code received');
});

app.post('/api/tradingview/token', requireAuth, (req, res) => {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'No authorization code provided' });
    const accessToken = `tv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const refreshToken = `tv_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    req.session.tradingViewAuth = {
        accessToken,
        refreshToken,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        userId: req.session.userId || 'user_' + Date.now()
    };
    return res.json({
        accessToken,
        refreshToken,
        expiresAt: req.session.tradingViewAuth.expiresAt,
        userId: req.session.tradingViewAuth.userId
    });
});

app.get('/api/tradingview/watchlists', requireAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token || !req.session.tradingViewAuth || req.session.tradingViewAuth.accessToken !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.json([
        { id: 'nse_stocks', name: 'NSE Stocks', symbols: ['NSE:RELIANCE', 'NSE:TCS', 'NSE:HDFCBANK'] },
        { id: 'indian_market', name: 'Indian Market', symbols: ['NSE:INFY', 'NSE:ICICIBANK', 'NSE:SBIN'] }
    ]);
});

app.get('/api/tradingview/watchlist/:watchlistId', requireAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token || !req.session.tradingViewAuth || req.session.tradingViewAuth.accessToken !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const lists = {
        nse_stocks: ['NSE:RELIANCE', 'NSE:TCS', 'NSE:HDFCBANK', 'NSE:INFY', 'NSE:ICICIBANK'],
        indian_market: ['NSE:INFY', 'NSE:ICICIBANK', 'NSE:SBIN', 'NSE:BHARTIARTL']
    };
    return res.json(lists[req.params.watchlistId] || []);
});

app.get('/api/tradingview/chart/:symbol', requireAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token || !req.session.tradingViewAuth || req.session.tradingViewAuth.accessToken !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const basePrice = 1000 + Math.random() * 5000;
    const candles = [];
    const now = Date.now();
    for (let i = 100; i >= 0; i--) {
        const timestamp = now - i * 24 * 60 * 60 * 1000;
        const open = basePrice * (1 + (Math.random() - 0.5) * 0.02);
        const close = open * (1 + (Math.random() - 0.5) * 0.03);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        candles.push({
            time: Math.floor(timestamp / 1000),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000) + 100000
        });
    }
    return res.json({ symbol: req.params.symbol, candles, timeframe: '1D' });
});

// Secure AI generation endpoint
app.post('/api/generate', requireAuth, async (req, res) => {
    try {
        if (!API_KEY) return res.status(503).json({ error: 'Service unavailable' });
        const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        const response = await fetch('https://api.euron.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4.1',
                messages: [
                    { role: 'system', content: 'You are an expert Pine Script developer. Output ONLY valid Pine Script v5 code, no explanations.' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            return res.status(502).json({ error: 'Upstream service error' });
        }

        const data = await response.json();
        const code = data?.choices?.[0]?.message?.content || '';
        if (!code) return res.status(500).json({ error: 'No code returned' });
        return res.json({ code });
    } catch (error) {
        console.error('AI generation error');
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        service: 'Yash AI - NSE Trading Assistant',
        timestamp: new Date().toISOString(),
        authenticated: !!req.session.authenticated,
        tradingViewConnected: !!(req.session.tradingViewAuth && req.session.tradingViewAuth.accessToken)
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error');
    return res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', () => {
    console.error('Server failed to start');
});

process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});

