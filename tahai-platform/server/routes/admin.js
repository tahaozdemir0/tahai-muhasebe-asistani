const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Admin kontrolü — sadece rol=admin kullanıcılar
function adminOnly(req, res, next) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekli' });
  }
  next();
}

// GET /api/admin/users — tüm kullanıcıları listele
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, ad, kullanici_adi, rol, aktif, created_at, last_seen')
    .order('last_seen', { ascending: false, nullsFirst: false });

  if (error) {
    return res.status(500).json({ error: 'Kullanıcılar alınamadı' });
  }

  // "aktif şu an" = son 15 dakika içinde görüldü
  const now = Date.now();
  const sonuc = users.map(u => ({
    ...u,
    online: u.last_seen && (now - new Date(u.last_seen).getTime()) < 15 * 60 * 1000
  }));

  const onlineSayisi = sonuc.filter(u => u.online).length;
  res.json({ users: sonuc, toplam: sonuc.length, online: onlineSayisi });
});

// PATCH /api/admin/users/:id — kullanıcı aktif/pasif yap veya rol değiştir
router.patch('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;
  const guncelleme = {};

  if (typeof req.body.aktif === 'boolean') guncelleme.aktif = req.body.aktif;
  if (req.body.rol && ['admin', 'user'].includes(req.body.rol)) guncelleme.rol = req.body.rol;

  if (Object.keys(guncelleme).length === 0) {
    return res.status(400).json({ error: 'Güncellenecek alan yok' });
  }

  const { error } = await supabase
    .from('users')
    .update(guncelleme)
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: 'Güncelleme başarısız' });
  }

  res.json({ ok: true });
});

module.exports = router;
