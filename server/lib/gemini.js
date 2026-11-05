
'use strict';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

async function generateContent(messages, systemPrompt, apiKey, model) {
    const url = GEMINI_API_BASE + model + ':generateContent?key=' + encodeURIComponent(apiKey);

    const body = {
        contents: messages.map(function (m) {
            return { role: m.role, parts: [{ text: m.text }] };
        }),
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.95
        }
    };

    if (systemPrompt) {
        body.system_instruction = { parts: [{ text: systemPrompt }] };
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        let errorBody = '';
        try { errorBody = await response.text(); } catch (e) {}
        const err = new Error('Gemini API error: ' + response.status);
        err.status = response.status;
        err.body = errorBody;
        throw err;
    }

    const data = await response.json();

    
    if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            return candidate.content.parts[0].text || '';
        }
    }

    
    if (data.promptFeedback && data.promptFeedback.blockReason) {
        return 'Maaf, pesan tidak dapat diproses. Coba dengan kata yang berbeda.';
    }

    return '';
}

module.exports = { generateContent };
