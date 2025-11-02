const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'yash_nft_ai.html');
    
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

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'Yash AI - NSE Trading Assistant',
        timestamp: new Date().toISOString()
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

