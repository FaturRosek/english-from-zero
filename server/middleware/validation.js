
'use strict';

const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10);
const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES || '50', 10);

function validateChatRequest(req, res, next) {
    var body = req.body || {};
    var messages = body.messages;
    var systemPrompt = body.systemPrompt;

    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'invalid-input',
            message: 'Field "messages" wajib berupa array dan tidak boleh kosong.'
        });
    }

    
    if (messages.length > MAX_MESSAGES) {
        return res.status(400).json({
            success: false,
            error: 'too-many-messages',
            message: 'Maksimum ' + MAX_MESSAGES + ' pesan per request.'
        });
    }

    
    for (var i = 0; i < messages.length; i++) {
        var msg = messages[i];
        if (!msg || typeof msg !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'invalid-message',
                message: 'Pesan ke-' + (i + 1) + ' tidak valid.'
            });
        }
        if (!msg.role || (msg.role !== 'user' && msg.role !== 'model')) {
            return res.status(400).json({
                success: false,
                error: 'invalid-role',
                message: 'Pesan ke-' + (i + 1) + ': role harus "user" atau "model".'
            });
        }
        if (!msg.text || typeof msg.text !== 'string' || msg.text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'invalid-text',
                message: 'Pesan ke-' + (i + 1) + ': text wajib dan tidak boleh kosong.'
            });
        }
        if (msg.text.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                success: false,
                error: 'message-too-long',
                message: 'Pesan ke-' + (i + 1) + ': terlalu panjang (max ' + MAX_MESSAGE_LENGTH + ' karakter).'
            });
        }
    }

    
    if (systemPrompt !== undefined && systemPrompt !== null && typeof systemPrompt !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'invalid-system-prompt',
            message: 'Field "systemPrompt" harus berupa string.'
        });
    }

    
    body.messages = messages.map(function (m) {
        return { role: m.role, text: m.text.trim() };
    });
    if (systemPrompt) {
        body.systemPrompt = systemPrompt.trim();
    }

    req.body = body;
    next();
}

module.exports = { validateChatRequest };
