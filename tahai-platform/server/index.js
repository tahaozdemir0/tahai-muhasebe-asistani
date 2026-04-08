require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes     = require('./routes/auth');
const mukellefRoutes = require('./routes/mukellef');
const zRaporuRoutes  = require('./routes/z-raporu');
const fisRoutes      = require('./routes/fis');
const mizanRoutes    = require('./routes/mizan');
const faturaRoutes   = require('./routes/fatura');
const claudeRoutes   = require('./routes/claude');
const syncRoutes     = require('./routes/sync');
const adminRoutes    = require('./routes/admin');
const hesapPlaniRoutes = require('./routes/hesap-plani');
const kontrolSonuclariRoutes = require('./routes/kontrol-sonuclari');
const donemKapanisRoutes = require('./routes/donem-kapanis');

const app = express();
const PORT = process.env.PORT || 3001;

// X-Powered-By kaldır
app.disable('x-powered-by');

// Helmet — güvenlik başlıkları (CSP devre dışı — legacy HTML inline handler'ları için)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://tahai-muhasebe-asistani-production-e822.up.railway.app',
      'https://tahai.app',
      'https://tahai.com.tr'
    ]
  : ['http://localhost:3001', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 dakika
  max: 60,
  message: { error: 'Çok fazla istek. Lütfen bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 dakika
  max: 10,
  message: { error: 'Çok fazla giriş denemesi. 5 dakika bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 saat
  max: 5,
  message: { error: 'Bu IP\'den çok fazla kayıt. 1 saat bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json({ limit: '20mb' }));

// Client klasörünü statik sun
app.use(express.static(path.join(__dirname, '../client')));

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.2.0', timestamp: new Date().toISOString() });
});

// Auth route'ları — rate limit ile
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth',     authRoutes);

// Diğer API route'ları
app.use('/api', apiLimiter);
app.use('/api/mukellef', mukellefRoutes);
app.use('/api/z-raporu', zRaporuRoutes);
app.use('/api/fis',      fisRoutes);
app.use('/api/mizan',    mizanRoutes);
app.use('/api/fatura',   faturaRoutes);
app.use('/api/claude',   claudeRoutes);
app.use('/api/sync',     syncRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/hesap-plani', hesapPlaniRoutes);
app.use('/api/kontrol-sonuclari', kontrolSonuclariRoutes);
app.use('/api/donem-kapanis', donemKapanisRoutes);

// Giriş/Kayıt sayfası
app.get('/giris', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/auth.html'));
});

// Admin sayfası
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/admin.html'));
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err.message);
  res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
  console.log(`TahAI Platform v1.2.0 — http://localhost:${PORT}`);
  console.log(`Ortam: ${process.env.NODE_ENV || 'development'}`);
});
