const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/fis/:mukellefId — Fişler listele
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;
  const { donem } = req.query;

  let query = supabase
    .from('fisler')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('tarih', { ascending: false });

  if (donem) query = query.eq('donem', donem);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ fisler: data });
});

// POST /api/fis — Yeni fiş kaydet
router.post('/', async (req, res) => {
  const {
    mukellef_id, tarih, fis_no, fis_turu, satici,
    kdv_orani, matrah, kdv_tutari, toplam, donem,
    hesap_kodu, gorsel_url, ai_verisi
  } = req.body;

  if (!mukellef_id || !tarih) {
    return res.status(400).json({ error: 'mukellef_id ve tarih zorunlu' });
  }

  // Mükellef sahiplik kontrolü
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  const { data, error } = await supabase
    .from('fisler')
    .insert({
      user_id: req.user.id,
      mukellef_id,
      tarih,
      fis_no: fis_no || '',
      fis_turu: fis_turu || '',
      satici: satici || '',
      kdv_orani: kdv_orani || 0,
      matrah: matrah || 0,
      kdv_tutari: kdv_tutari || 0,
      toplam: toplam || 0,
      donem: donem || '',
      hesap_kodu: hesap_kodu || '',
      gorsel_url: gorsel_url || '',
      ai_verisi: ai_verisi || null
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ fis: data });
});

// POST /api/fis/bulk — Toplu fiş kaydet (birden fazla fiş)
router.post('/bulk', async (req, res) => {
  const { mukellef_id, fisler } = req.body;

  if (!mukellef_id || !Array.isArray(fisler) || fisler.length === 0) {
    return res.status(400).json({ error: 'mukellef_id ve fisler dizisi zorunlu' });
  }

  // Mükellef sahiplik kontrolü
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  const rows = fisler.map(f => ({
    user_id: req.user.id,
    mukellef_id,
    tarih: f.tarih || '',
    fis_no: f.fis_no || '',
    fis_turu: f.fis_turu || '',
    satici: f.satici || '',
    kdv_orani: f.kdv_orani || 0,
    matrah: f.matrah || 0,
    kdv_tutari: f.kdv_tutari || 0,
    toplam: f.toplam || 0,
    donem: f.donem || '',
    hesap_kodu: f.hesap_kodu || '',
    gorsel_url: f.gorsel_url || '',
    ai_verisi: f.ai_verisi || null
  }));

  const { data, error } = await supabase
    .from('fisler')
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ fisler: data, count: data.length });
});

// DELETE /api/fis/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('fisler')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Fiş bulunamadı' });

  const { error } = await supabase
    .from('fisler')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
