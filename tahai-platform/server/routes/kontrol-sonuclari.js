const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/kontrol-sonuclari/:mukellefId — Kontrol sonuçlarını listele
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;
  const { donem, kontrol_turu } = req.query;

  let query = supabase
    .from('kontrol_sonuclari')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('olusturma', { ascending: false });

  if (donem) query = query.eq('donem', donem);
  if (kontrol_turu) query = query.eq('kontrol_turu', kontrol_turu);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ sonuclar: data });
});

// POST /api/kontrol-sonuclari — Yeni kontrol sonucu kaydet
router.post('/', async (req, res) => {
  const { mukellef_id, donem, kontrol_turu, sonuc_data, risk_skoru } = req.body;

  if (!mukellef_id || !kontrol_turu) {
    return res.status(400).json({ error: 'mukellef_id ve kontrol_turu zorunlu' });
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
    .from('kontrol_sonuclari')
    .insert({
      user_id: req.user.id,
      mukellef_id,
      donem: donem || '',
      kontrol_turu,
      sonuc_data: sonuc_data || null,
      risk_skoru: risk_skoru || 0
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ sonuc: data });
});

// DELETE /api/kontrol-sonuclari/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('kontrol_sonuclari')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Kontrol sonucu bulunamadı' });

  const { error } = await supabase
    .from('kontrol_sonuclari')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
