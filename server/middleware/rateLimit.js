
'use strict';

const rateLimit = require('express-rate-limit');

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '20', 10);

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: RATE_LIMIT_PER_MINUTE,
    message: {
        success: false,
        error: 'rate-limit',
        message: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { apiLimiter };
