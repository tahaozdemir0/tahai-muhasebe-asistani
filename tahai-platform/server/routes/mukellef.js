const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Tüm route'lar JWT korumalı
router.use(authMiddleware);

// GET /api/mukellef — Mükellef listesi
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('mukellefler')
    .select('*')
    .eq('user_id', req.user.id)
    .order('ad', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mukellefler: data });
});

// GET /api/mukellef/:id — Tek mükellef
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('mukellefler')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Mükellef bulunamadı' });
  res.json({ mukellef: data });
});

// POST /api/mukellef — Yeni mükellef
router.post('/', async (req, res) => {
  const { ad, unvan, vkn, vergi_dairesi, tur, adres, tel, email, kdv_periyot } = req.body;
  const not_field = req.body.not;

  if (!ad) return res.status(400).json({ error: 'Mükellef adı zorunlu' });

  const { data, error } = await supabase
    .from('mukellefler')
    .insert({
      user_id: req.user.id,
      ad,
      unvan: unvan || '',
      vkn: vkn || '',
      vergi_dairesi: vergi_dairesi || '',
      tur: tur || '',
      adres: adres || '',
      tel: tel || '',
      email: email || '',
      not: not_field || '',
      kdv_periyot: kdv_periyot || 'aylik'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ mukellef: data });
});

// PUT /api/mukellef/:id — Güncelle
router.put('/:id', async (req, res) => {
  const { ad, unvan, vkn, vergi_dairesi, tur, adres, tel, email, kdv_periyot } = req.body;
  const not_field = req.body.not;

  // Önce sahiplik kontrol et
  const { data: existing } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Mükellef bulunamadı' });

  const updates = { guncelleme: new Date().toISOString() };
  if (ad !== undefined) updates.ad = ad;
  if (unvan !== undefined) updates.unvan = unvan;
  if (vkn !== undefined) updates.vkn = vkn;
  if (vergi_dairesi !== undefined) updates.vergi_dairesi = vergi_dairesi;
  if (tur !== undefined) updates.tur = tur;
  if (adres !== undefined) updates.adres = adres;
  if (tel !== undefined) updates.tel = tel;
  if (email !== undefined) updates.email = email;
  if (not_field !== undefined) updates.not = not_field;
  if (kdv_periyot !== undefined) updates.kdv_periyot = kdv_periyot;

  const { data, error } = await supabase
    .from('mukellefler')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mukellef: data });
});

// DELETE /api/mukellef/:id — Sil
router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Mükellef bulunamadı' });

  const { error } = await supabase
    .from('mukellefler')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
