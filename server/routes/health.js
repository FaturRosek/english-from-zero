
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.json({
        status: 'ok',
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
