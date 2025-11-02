const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Password configuration
const CORRECT_PASSWORD = 'Yash1979161210';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'yash-ai-secret-key-2024-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true only if using HTTPS (Render free tier may not have HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'yash-ai-session'
}));

// Serve static files from the current directory
app.use(express.static(__dirname));

// TradingView OAuth Configuration
// Note: In production, register your app at https://www.tradingview.com/widget-docs/
// and set these environment variables
const TRADINGVIEW_CLIENT_ID = process.env.TRADINGVIEW_CLIENT_ID || 'yash_nse_trading_ai';
const TRADINGVIEW_CLIENT_SECRET = process.env.TRADINGVIEW_CLIENT_SECRET || '';
const TRADINGVIEW_REDIRECT_URI = process.env.TRADINGVIEW_REDIRECT_URI || '';

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        return next();
    }
    res.redirect('/login');
}

// Login page
app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        return res.redirect('/');
    }
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Yash AI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            padding: 40px;
            max-width: 400px;
            width: 100%;
        }
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .login-header h1 {
            color: white;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .login-header p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            color: white;
            font-size: 16px;
            outline: none;
            transition: all 0.3s;
        }
        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        .form-group input:focus {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
        }
        .error-message {
            background: rgba(244, 67, 54, 0.3);
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        .error-message.show {
            display: block;
        }
        .login-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .login-btn:active {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>🔒 Yash AI</h1>
            <p>NSE Trading Intelligence Assistant</p>
        </div>
        <div class="error-message" id="errorMessage">Invalid password. Please try again.</div>
        <form action="/login" method="POST" id="loginForm">
            <div class="form-group">
                <label for="password">Enter Password</label>
                <input type="password" id="password" name="password" placeholder="Enter access password" required autofocus>
            </div>
            <button type="submit" class="login-btn">Access Application</button>
        </form>
    </div>
    <script>
        // Check for error in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error') === '1') {
            document.getElementById('errorMessage').classList.add('show');
        }
        
        // Form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            if (!password) {
                e.preventDefault();
                document.getElementById('errorMessage').classList.add('show');
            }
        });
    </script>
</body>
</html>
    `);
});

// Handle login
app.post('/login', (req, res) => {
    const { password } = req.body;
    
    if (password === CORRECT_PASSWORD) {
        req.session.authenticated = true;
        res.redirect('/');
    } else {
        res.redirect('/login?error=1');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Serve the main HTML file (protected) - NSE Trading AI Application
app.get('/', requireAuth, (req, res) => {
    const htmlPath = path.join(__dirname, 'yash_nft_ai.html'); // Note: Filename contains 'nft' but content is 100% NSE-focused
    
    // Check if file exists
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error loading application');
            }
        });
    } else {
        console.error('HTML file not found at:', htmlPath);
        res.status(500).send('Application file not found');
    }
});

// TradingView OAuth Callback
app.get('/tradingview/callback', requireAuth, (req, res) => {
    const code = req.query.code;
    const error = req.query.error;
    
    if (error) {
        return res.send(`
            <html>
                <body>
                    <h2>Authentication Failed</h2>
                    <p>Error: ${error}</p>
                    <script>window.opener.postMessage({error: '${error}'}, '*'); window.close();</script>
                </body>
            </html>
        `);
    }
    
    if (code) {
        // Store code temporarily in session
        req.session.tradingViewCode = code;
        res.send(`
            <html>
                <body>
                    <h2>Authentication Successful</h2>
                    <p>Processing your login...</p>
                    <script>
                        window.opener.postMessage({code: '${code}'}, '*');
                        setTimeout(() => window.close(), 1000);
                    </script>
                </body>
            </html>
        `);
    } else {
        res.status(400).send('No authorization code received');
    }
});

// Exchange OAuth code for access token
app.post('/api/tradingview/token', requireAuth, async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'No authorization code provided' });
        }
        
        // In production, exchange code for token with TradingView API
        // For now, we'll simulate this process
        // Replace this with actual TradingView OAuth token endpoint
        const tokenUrl = 'https://www.tradingview.com/oauth/token';
        
        // Simulated token exchange (replace with actual TradingView API call)
        // const response = await fetch(tokenUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body: new URLSearchParams({
        //         grant_type: 'authorization_code',
        //         client_id: TRADINGVIEW_CLIENT_ID,
        //         client_secret: TRADINGVIEW_CLIENT_SECRET,
        //         code: code,
        //         redirect_uri: TRADINGVIEW_REDIRECT_URI
        //     })
        // });
        
        // For development/demo: Store a session token
        // In production, use actual TradingView token response
        const accessToken = `tv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const refreshToken = `tv_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        // Store token in session (secure server-side storage)
        req.session.tradingViewAuth = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            userId: req.session.userId || 'user_' + Date.now()
        };
        
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresAt: req.session.tradingViewAuth.expiresAt,
            userId: req.session.tradingViewAuth.userId
        });
        
    } catch (error) {
        console.error('Token exchange error:', error);
        res.status(500).json({ error: 'Failed to exchange token' });
    }
});

// Get TradingView watchlists
app.get('/api/tradingview/watchlists', requireAuth, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authorization token' });
        }
        
        // Verify token matches session (in production, verify with TradingView)
        const token = authHeader.substring(7);
        const sessionAuth = req.session.tradingViewAuth;
        
        if (!sessionAuth || sessionAuth.accessToken !== token) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        // In production, fetch from TradingView API
        // const response = await fetch('https://www.tradingview.com/api/v1/watchlists', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        // const watchlists = await response.json();
        
        // For demo: Return simulated watchlists
        res.json([
            { id: 'nse_stocks', name: 'NSE Stocks', symbols: ['NSE:RELIANCE', 'NSE:TCS', 'NSE:HDFCBANK'] },
            { id: 'indian_market', name: 'Indian Market', symbols: ['NSE:INFY', 'NSE:ICICIBANK', 'NSE:SBIN'] }
        ]);
        
    } catch (error) {
        console.error('Watchlists error:', error);
        res.status(500).json({ error: 'Failed to fetch watchlists' });
    }
});

// Get watchlist symbols
app.get('/api/tradingview/watchlist/:watchlistId', requireAuth, async (req, res) => {
    try {
        const { watchlistId } = req.params;
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authorization token' });
        }
        
        const token = authHeader.substring(7);
        const sessionAuth = req.session.tradingViewAuth;
        
        if (!sessionAuth || sessionAuth.accessToken !== token) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        // In production, fetch from TradingView API
        // For demo: Return symbols based on watchlist ID
        const watchlists = {
            'nse_stocks': ['NSE:RELIANCE', 'NSE:TCS', 'NSE:HDFCBANK', 'NSE:INFY', 'NSE:ICICIBANK'],
            'indian_market': ['NSE:INFY', 'NSE:ICICIBANK', 'NSE:SBIN', 'NSE:BHARTIARTL']
        };
        
        res.json(watchlists[watchlistId] || []);
        
    } catch (error) {
        console.error('Watchlist symbols error:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist symbols' });
    }
});

// Get TradingView chart data
app.get('/api/tradingview/chart/:symbol', requireAuth, async (req, res) => {
    try {
        const { symbol } = req.params;
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authorization token' });
        }
        
        const token = authHeader.substring(7);
        const sessionAuth = req.session.tradingViewAuth;
        
        if (!sessionAuth || sessionAuth.accessToken !== token) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        // In production, fetch from TradingView Charting Library API
        // const response = await fetch(`https://www.tradingview.com/api/v1/chart/${encodeURIComponent(symbol)}`, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        // const chartData = await response.json();
        
        // For demo: Generate realistic candle data
        const basePrice = 1000 + Math.random() * 5000;
        const candles = [];
        const now = Date.now();
        
        for (let i = 100; i >= 0; i--) {
            const timestamp = now - (i * 24 * 60 * 60 * 1000); // Daily candles
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
        
        res.json({
            symbol: symbol,
            candles: candles,
            timeframe: '1D'
        });
        
    } catch (error) {
        console.error('Chart data error:', error);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

// Health check endpoint for Render (no auth required)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'Yash AI - NSE Trading Assistant',
        timestamp: new Date().toISOString(),
        authenticated: req.session.authenticated || false,
        tradingViewConnected: !!(req.session.tradingViewAuth?.accessToken)
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server - listen on all interfaces for Render
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Yash AI Server is running on port ${PORT}`);
    console.log(`📊 NSE Trading Assistant is ready!`);
    console.log(`📍 Server listening on 0.0.0.0:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

