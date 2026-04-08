const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/donem-kapanis/:mukellefId — Dönem kapanış listesi
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;
  const { donem } = req.query;

  let query = supabase
    .from('donem_kapanis')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('donem', { ascending: false });

  if (donem) query = query.eq('donem', donem);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ kapanislar: data });
});

// POST /api/donem-kapanis — Yeni dönem kapanış oluştur/güncelle (upsert)
router.post('/', async (req, res) => {
  const { mukellef_id, donem, checklist, tamamlanma_yuzdesi } = req.body;

  if (!mukellef_id || !donem) {
    return res.status(400).json({ error: 'mukellef_id ve donem zorunlu' });
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
    .from('donem_kapanis')
    .upsert({
      user_id: req.user.id,
      mukellef_id,
      donem,
      checklist: checklist || [],
      tamamlanma_yuzdesi: tamamlanma_yuzdesi || 0,
      guncelleme: new Date().toISOString()
    }, { onConflict: 'user_id,mukellef_id,donem' })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ kapanis: data });
});

// DELETE /api/donem-kapanis/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('donem_kapanis')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Dönem kapanış bulunamadı' });

  const { error } = await supabase
    .from('donem_kapanis')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
