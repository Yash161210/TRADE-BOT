const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'yash_nft_ai.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Yash AI - NSE Trading Assistant' });
});

app.listen(PORT, () => {
    console.log(`🚀 Yash AI Server is running on port ${PORT}`);
    console.log(`📊 NSE Trading Assistant is ready!`);
});

