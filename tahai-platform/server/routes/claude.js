const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /api/claude
// Anthropic API proxy — API key tarayıcıdan gizlenir, server üzerinden çağrılır.
// Öncelik: .env'deki ANTHROPIC_API_KEY → request body'deki api_key (geçiş dönemi)
router.post('/', async (req, res) => {
  const { prompt, image, api_key: clientKey } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt alanı zorunlu' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || clientKey;
  if (!apiKey) {
    return res.status(400).json({
      error: 'Anthropic API anahtarı bulunamadı. .env dosyasına ANTHROPIC_API_KEY ekleyin veya Ayarlar sayfasından girin.'
    });
  }

  const content = [];

  // Görsel varsa ekle
  if (image && image.data && image.mediaType) {
    if (image.mediaType === 'application/pdf') {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: image.data }
      });
    } else {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: image.mediaType, data: image.data }
      });
    }
  }

  content.push({ type: 'text', text: prompt });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content }]
      })
    });

    if (!resp.ok) {
      const err = await resp.json();
      return res.status(resp.status).json({
        error: err.error?.message || 'Anthropic API hatası'
      });
    }

    const data = await resp.json();
    const text = data.content.map(c => c.text || '').join('');
    res.json({ text });

  } catch (e) {
    console.error('[Claude Proxy]', e.message);
    res.status(500).json({ error: 'Claude API bağlantı hatası: ' + e.message });
  }
});

module.exports = router;
