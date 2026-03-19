require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes    = require('./routes/auth');
const mukellefRoutes = require('./routes/mukellef');
const zRaporuRoutes = require('./routes/z-raporu');
const fisRoutes     = require('./routes/fis');
const mizanRoutes   = require('./routes/mizan');
const faturaRoutes  = require('./routes/fatura');
const claudeRoutes  = require('./routes/claude');
const syncRoutes    = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tahai.app', 'https://tahai.com.tr']
    : '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' })); // Base64 görsel/PDF için

// Client klasörünü statik olarak sun
// tahai-api.js ve index.html buradan gelir
app.use(express.static(path.join(__dirname, '../client')));

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.1.0', timestamp: new Date().toISOString() });
});

// Route'lar
app.use('/api/auth',     authRoutes);
app.use('/api/mukellef', mukellefRoutes);
app.use('/api/z-raporu', zRaporuRoutes);
app.use('/api/fis',      fisRoutes);
app.use('/api/mizan',    mizanRoutes);
app.use('/api/fatura',   faturaRoutes);
app.use('/api/claude',   claudeRoutes);
app.use('/api/sync',     syncRoutes);

// SPA fallback — /api olmayan tüm istekler index.html'e
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);
  res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`TahAI Platform — http://localhost:${PORT}`);
  console.log(`Ortam: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY .env\'de yok — Claude proxy için client API key kullanılacak');
  }
});
