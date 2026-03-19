const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Input temizleme — HTML tag strip
function strip(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().substring(0, 500);
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const email        = strip(req.body.email || '').toLowerCase();
  const password     = req.body.password || '';
  const kullanici_adi = strip(req.body.kullanici_adi || '').toLowerCase();
  const ad           = strip(req.body.ad || '').substring(0, 100);

  // Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Geçerli bir email adresi girin' });
  }
  // Şifre
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı' });
  }
  // Kullanıcı adı
  if (!kullanici_adi) {
    return res.status(400).json({ error: 'Kullanıcı adı zorunlu' });
  }
  if (!/^[a-z0-9_]{3,30}$/.test(kullanici_adi)) {
    return res.status(400).json({ error: 'Kullanıcı adı 3-30 karakter, sadece harf/rakam/alt çizgi' });
  }

  // Email var mı kontrol et
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingEmail) {
    return res.status(409).json({ error: 'Bu email zaten kayıtlı' });
  }

  // Kullanıcı adı var mı kontrol et
  const { data: existingUsername } = await supabase
    .from('users')
    .select('id')
    .eq('kullanici_adi', kullanici_adi)
    .single();

  if (existingUsername) {
    return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış' });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, password_hash, ad: ad || kullanici_adi, kullanici_adi })
    .select('id, email, ad, kullanici_adi, rol')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Kayıt sırasında hata oluştu', detail: error.message });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const email    = strip(req.body.email || '').toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email/kullanıcı adı ve şifre zorunlu' });
  }
  if (password.length > 200) {
    return res.status(400).json({ error: 'Geçersiz istek' });
  }

  // Email veya kullanıcı adıyla giriş
  const isEmail = email.includes('@');
  const query = supabase.from('users').select('id, email, ad, kullanici_adi, rol, password_hash, aktif');
  const { data: user, error } = await (isEmail
    ? query.eq('email', email)
    : query.eq('kullanici_adi', email)
  ).single();

  if (error || !user) {
    return res.status(401).json({ error: 'Email veya şifre hatalı' });
  }

  if (!user.aktif) {
    return res.status(403).json({ error: 'Hesabınız aktif değil' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Email veya şifre hatalı' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, ad, rol, aktif, created_at')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  res.json({ user });
});

module.exports = router;
