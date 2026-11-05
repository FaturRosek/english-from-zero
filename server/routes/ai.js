
'use strict';

const express = require('express');
const router = express.Router();
const { generateContent } = require('../lib/gemini');
const { validateChatRequest } = require('../middleware/validation');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview';

router.post('/chat', validateChatRequest, async function (req, res) {
    try {
        var messages = req.body.messages;
        var systemPrompt = req.body.systemPrompt || '';

        var aiText = await generateContent(messages, systemPrompt, GEMINI_API_KEY, GEMINI_MODEL);

        if (!aiText) {
            return res.json({
                success: false,
                error: 'empty-response',
                message: 'AI tidak memberikan respons. Coba kirim pesan lagi.'
            });
        }

        var isCorrection = aiText.indexOf('Better sentence:') !== -1 ||
                           aiText.indexOf('Penjelasan:') !== -1;

        res.json({ success: true, text: aiText, isCorrection: isCorrection });
    } catch (error) {
        handleGeminiError(error, res);
    }
});

router.post('/session-end', validateChatRequest, async function (req, res) {
    try {
        var messages = req.body.messages;
        var systemPrompt = req.body.systemPrompt || '';

        var reviewText = await generateContent(messages, systemPrompt, GEMINI_API_KEY, GEMINI_MODEL);

        res.json({
            success: true,
            review: reviewText || 'Tidak ada ringkasan yang dihasilkan.'
        });
    } catch (error) {
        handleGeminiError(error, res);
    }
});

function handleGeminiError(error, res) {
    var status = (error && error.status) || 0;
    var errorMap = {
        400: { code: 'bad-request', message: 'Permintaan tidak valid. Mungkin pesan terlalu panjang.' },
        403: { code: 'invalid-key', message: 'API key tidak valid. Periksa konfigurasi GEMINI_API_KEY di file .env server.' },
        404: { code: 'model-not-found', message: 'Model AI tidak ditemukan. Periksa GEMINI_MODEL di .env. Disarankan: gemini-2.5-flash-preview' },
        429: { code: 'rate-limit', message: 'Batas permintaan Gemini API tercapai. Tunggu sebentar lalu coba lagi.' },
        500: { code: 'server-error', message: 'Server Gemini sedang bermasalah. Coba lagi nanti.' },
        503: { code: 'server-error', message: 'Server Gemini tidak tersedia saat ini. Coba lagi nanti.' }
    };

    var err = errorMap[status];
    if (!err) {
        
        err = {
            code: 'unknown',
            message: 'Terjadi kesalahan pada server. Coba lagi. (Status: ' + status + ')'
        };
    }

    var httpStatus = (status >= 400 && status < 500) ? status : 502;
    res.status(httpStatus).json({ success: false, error: err.code, message: err.message });
}

module.exports = router;
