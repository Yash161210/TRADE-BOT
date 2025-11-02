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

// Health check endpoint for Render (no auth required)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'Yash AI - NSE Trading Assistant',
        timestamp: new Date().toISOString(),
        authenticated: req.session.authenticated || false
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

