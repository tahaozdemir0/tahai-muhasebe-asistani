const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/mizan/:mukellefId — Mizanlar listele
router.get('/:mukellefId', async (req, res) => {
  const { mukellefId } = req.params;

  const { data, error } = await supabase
    .from('mizanlar')
    .select('id, donem, tarih_araligi, firma_adi, anomali_raporu, hesap_ozeti, ters_bakiyeler, dosya_adi, created_at')
    // satirlar JSONB büyük olabilir, listede gönderme
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellefId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mizanlar: data });
});

// GET /api/mizan/:mukellefId/:id — Tek mizan (satirlar dahil)
router.get('/:mukellefId/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('mizanlar')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .eq('mukellef_id', req.params.mukellefId)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Mizan bulunamadı' });
  res.json({ mizan: data });
});

// POST /api/mizan — Mizan kaydet
router.post('/', async (req, res) => {
  const { mukellef_id, donem, tarih_araligi, firma_adi, satirlar, anomali_raporu, hesap_ozeti, ters_bakiyeler, dosya_adi } = req.body;

  if (!mukellef_id) {
    return res.status(400).json({ error: 'mukellef_id zorunlu' });
  }

  // Mükellef sahiplik kontrolü
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  // Aynı dönem için mevcut mizan varsa güncelle (UPSERT mantığı)
  const insertData = {
    user_id: req.user.id,
    mukellef_id,
    donem: donem || '',
    tarih_araligi: tarih_araligi || '',
    firma_adi: firma_adi || '',
    satirlar: satirlar || [],
    anomali_raporu: anomali_raporu || '',
    hesap_ozeti: hesap_ozeti || null,
    ters_bakiyeler: ters_bakiyeler || null,
    dosya_adi: dosya_adi || ''
  };

  const { data, error } = await supabase
    .from('mizanlar')
    .upsert(insertData, { onConflict: 'user_id,mukellef_id,donem' })
    .select('id, donem, tarih_araligi, firma_adi, anomali_raporu, hesap_ozeti, ters_bakiyeler, dosya_adi, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ mizan: data });
});

// PUT /api/mizan/:id/anomali — Anomali raporunu güncelle (AI analiz sonrası)
router.put('/:id/anomali', async (req, res) => {
  const { anomali_raporu } = req.body;

  const { data: existing } = await supabase
    .from('mizanlar')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Mizan bulunamadı' });

  const { data, error } = await supabase
    .from('mizanlar')
    .update({ anomali_raporu })
    .eq('id', req.params.id)
    .select('id, anomali_raporu')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mizan: data });
});

// DELETE /api/mizan/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('mizanlar')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Mizan bulunamadı' });

  const { error } = await supabase
    .from('mizanlar')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
