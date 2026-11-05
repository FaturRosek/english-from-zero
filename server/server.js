
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const aiRoutes = require('./routes/ai');
const healthRoutes = require('./routes/health');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
    console.error('\n[ERROR] GEMINI_API_KEY belum diatur!');
    console.error('  1. Salin .env.example menjadi .env');
    console.error('  2. Isi GEMINI_API_KEY dengan API key dari https://aistudio.google.com');
    console.error('  3. Jalankan ulang: npm start\n');
    process.exit(1);
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5500,null')
    .split(',')
    .map(function (o) { return o.trim(); });

app.use(cors({
    origin: function (origin, callback) {
        
        if (!origin || origin === 'null' || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false
}));

app.use(express.json({ limit: '100kb' }));

app.use('/api/', apiLimiter);

app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

app.use(express.static(path.join(__dirname, '..')));

app.use(function (req, res) {
    res.status(404).json({
        success: false,
        error: 'not-found',
        message: 'Endpoint tidak ditemukan: ' + req.method + ' ' + req.path
    });
});

app.use(function (err, req, res, next) {
    console.error('[Server Error]', err.message);
    res.status(500).json({
        success: false,
        error: 'server-error',
        message: 'Terjadi kesalahan pada server.'
    });
});

app.listen(PORT, function () {
    console.log('');
    console.log('========================================');
    console.log('  English From Zero — Backend Server');
    console.log('========================================');
    console.log('  URL:   http://localhost:' + PORT);
    console.log('  Model: ' + (process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview'));
    console.log('  CORS:  ' + allowedOrigins.join(', '));
    console.log('  Rate:  ' + (process.env.RATE_LIMIT_PER_MINUTE || 20) + ' req/min per IP');
    console.log('========================================');
    console.log('');
    console.log('  AI Conversation endpoints:');
    console.log('    POST /api/ai/chat         — Kirim pesan ke AI');
    console.log('    POST /api/ai/session-end  — Akhiri sesi & dapatkan review');
    console.log('    GET  /api/health           — Status server');
    console.log('');
    console.log('  Frontend: Buka index.html di browser');
    console.log('            Set Backend URL di Settings: http://localhost:' + PORT);
    console.log('');
});
