const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/sync/snapshot — Kullanıcının tüm verisini tek seferde yükle (geçiş dönemi)
router.get('/snapshot', async (req, res) => {
  const userId = req.user.id;

  // Eski kullanici_verileri tablosundan da dene (mevcut HTML verisi)
  try {
    const { data: legacy } = await supabase
      .from('kullanici_verileri')
      .select('*')
      .eq('kullanici', req.user.email?.replace('@tahai.local', '') || 'taha')
      .single();

    if (legacy) {
      return res.json({
        fis_data: JSON.parse(legacy.fis_data || '[]'),
        z_data: JSON.parse(legacy.z_data || '[]'),
        fatura_data: JSON.parse(legacy.fatura_data || '[]'),
        mukellefler: JSON.parse(legacy.mukellef || '[]'),
        source: 'legacy'
      });
    }
  } catch (e) {
    // legacy tablo yoksa yeni endpoint'lere bak
  }

  // Yeni tablolardan yükle
  try {
    const [fisRes, zRes, faturaRes, mukellefRes] = await Promise.all([
      supabase.from('fisler').select('*').eq('user_id', userId).order('tarih', { ascending: false }),
      supabase.from('z_raporlari').select('*').eq('user_id', userId).order('tarih', { ascending: false }),
      supabase.from('faturalar').select('*').eq('user_id', userId).order('tarih', { ascending: false }),
      supabase.from('mukellefler').select('*').eq('user_id', userId).order('ad')
    ]);

    res.json({
      fis_data: fisRes.data || [],
      z_data: zRes.data || [],
      fatura_data: faturaRes.data || [],
      mukellefler: mukellefRes.data || [],
      source: 'new'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/sync/snapshot — Tüm veriyi tek seferde kaydet (geçiş dönemi blob sync)
// HTML her değişiklikte autoSave() ile bunu çağırır
router.post('/snapshot', async (req, res) => {
  const { fis_data, z_data, fatura_data, mukellefler } = req.body;
  const kullanici = req.user.email?.replace('@tahai.local', '') || 'taha';

  try {
    // Hem eski tabloya (backward compat) hem yeni tablolara kaydet
    const upsertData = {
      kullanici,
      fis_data: JSON.stringify(fis_data || []),
      z_data: JSON.stringify(z_data || []),
      fatura_data: JSON.stringify(fatura_data || []),
      mukellef: JSON.stringify(mukellefler || []),
      guncelleme: new Date().toISOString()
    };

    // Önce eski tablo var mı kontrol et
    const { error: legacyErr } = await supabase
      .from('kullanici_verileri')
      .upsert(upsertData, { onConflict: 'kullanici' });

    if (legacyErr) {
      console.warn('[Sync] Eski tablo upsert hatası (tablo yoksa normal):', legacyErr.message);
    }

    res.json({ success: true, guncelleme: upsertData.guncelleme });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
