const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/z-raporu/:mukellefId — Z raporları listele
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;
  const { donem } = req.query; // ?donem=2024-01 gibi filtre

  let query = supabase
    .from('z_raporlari')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('tarih', { ascending: false });

  if (donem) query = query.eq('donem', donem);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ z_raporlari: data });
});

// POST /api/z-raporu — Yeni Z raporu kaydet
router.post('/', async (req, res) => {
  const {
    mukellef_id, tarih, z_sayac, toplam, topkdv,
    kdv_10_matrah, kdv_10_tutar,
    kdv_20_matrah, kdv_20_tutar,
    kdv_1_matrah, kdv_1_tutar,
    donem
  } = req.body;

  if (!mukellef_id || !tarih) {
    return res.status(400).json({ error: 'mukellef_id ve tarih zorunlu' });
  }

  // Mükellef bu kullanıcıya ait mi kontrol et
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  const { data, error } = await supabase
    .from('z_raporlari')
    .insert({
      user_id: req.user.id,
      mukellef_id,
      tarih,
      z_sayac: z_sayac || '',
      toplam: toplam || 0,
      topkdv: topkdv || 0,
      kdv_10_matrah: kdv_10_matrah || 0,
      kdv_10_tutar: kdv_10_tutar || 0,
      kdv_20_matrah: kdv_20_matrah || 0,
      kdv_20_tutar: kdv_20_tutar || 0,
      kdv_1_matrah: kdv_1_matrah || 0,
      kdv_1_tutar: kdv_1_tutar || 0,
      donem: donem || ''
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ z_raporu: data });
});

// DELETE /api/z-raporu/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('z_raporlari')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Z raporu bulunamadı' });

  const { error } = await supabase
    .from('z_raporlari')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
