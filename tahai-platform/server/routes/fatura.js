const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/fatura/:mukellefId — Faturalar listele
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;
  const { donem, tur } = req.query; // tur: 'alis' | 'satis'

  let query = supabase
    .from('faturalar')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('tarih', { ascending: false });

  if (donem) query = query.eq('donem', donem);
  if (tur) query = query.eq('tur', tur);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ faturalar: data });
});

// POST /api/fatura — Yeni fatura kaydet
router.post('/', async (req, res) => {
  const {
    mukellef_id, tarih, tur, belge_no, satici_alici,
    kdv_orani, matrah, kdv_tutari, toplam,
    donem, kaynak // kaynak: 'excel' | 'gorsel' | 'xml'
  } = req.body;

  if (!mukellef_id || !tarih || !tur) {
    return res.status(400).json({ error: 'mukellef_id, tarih ve tur (alis/satis) zorunlu' });
  }

  if (!['alis', 'satis'].includes(tur)) {
    return res.status(400).json({ error: "tur 'alis' veya 'satis' olmalı" });
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
    .from('faturalar')
    .insert({
      user_id: req.user.id,
      mukellef_id,
      tarih,
      tur,
      belge_no: belge_no || '',
      satici_alici: satici_alici || '',
      kdv_orani: kdv_orani || 0,
      matrah: matrah || 0,
      kdv_tutari: kdv_tutari || 0,
      toplam: toplam || 0,
      donem: donem || '',
      kaynak: kaynak || 'manuel'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ fatura: data });
});

// POST /api/fatura/bulk — Toplu fatura kaydet (Excel'den import)
router.post('/bulk', async (req, res) => {
  const { mukellef_id, faturalar } = req.body;

  if (!mukellef_id || !Array.isArray(faturalar) || faturalar.length === 0) {
    return res.status(400).json({ error: 'mukellef_id ve faturalar dizisi zorunlu' });
  }

  // Mükellef sahiplik kontrolü
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  const rows = faturalar.map(f => ({
    user_id: req.user.id,
    mukellef_id,
    tarih: f.tarih || '',
    tur: ['alis', 'satis'].includes(f.tur) ? f.tur : 'alis',
    belge_no: f.belge_no || '',
    satici_alici: f.satici_alici || '',
    kdv_orani: f.kdv_orani || 0,
    matrah: f.matrah || 0,
    kdv_tutari: f.kdv_tutari || 0,
    toplam: f.toplam || 0,
    donem: f.donem || '',
    kaynak: f.kaynak || 'excel'
  }));

  const { data, error } = await supabase
    .from('faturalar')
    .insert(rows)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ faturalar: data, count: data.length });
});

// DELETE /api/fatura/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('faturalar')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Fatura bulunamadı' });

  const { error } = await supabase
    .from('faturalar')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
