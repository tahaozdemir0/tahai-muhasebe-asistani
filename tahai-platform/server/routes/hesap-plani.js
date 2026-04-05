// Hesap Planı Eşleştirme Route'ları
// Mükellef bazlı hesap kodu → beyanname kategorisi eşlemesini Supabase'de saklar

const express  = require('express');
const supabase = require('../config/supabase');
const auth     = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/hesap-plani/:mukellefAd
// Bir mükellefe ait onaylanmış eşlemeleri çek
router.get('/:mukellefAd', async (req, res) => {
  const mukellef_ad = decodeURIComponent(req.params.mukellefAd);

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu')
    .eq('user_id', req.user.id)
    .eq('mukellef_ad', mukellef_ad)
    .eq('onaylandi', true);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// GET /api/hesap-plani/:mukellefAd/tumü
// Tüm eşlemeleri çek (onaysızlar dahil — modal için)
router.get('/:mukellefAd/tumu', async (req, res) => {
  const mukellef_ad = decodeURIComponent(req.params.mukellefAd);

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu, onaylandi')
    .eq('user_id', req.user.id)
    .eq('mukellef_ad', mukellef_ad);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// POST /api/hesap-plani
// Eşlemeleri kaydet (upsert — çakışınca güncelle)
router.post('/', async (req, res) => {
  const { mukellef_ad, eslesmeler } = req.body;

  if (!mukellef_ad || !Array.isArray(eslesmeler) || eslesmeler.length === 0) {
    return res.status(400).json({ error: 'mukellef_ad ve eslesmeler zorunlu' });
  }

  const rows = eslesmeler.map(e => ({
    user_id:        req.user.id,
    mukellef_ad,
    hesap_kodu:     e.hesap_kodu,
    hesap_adi:      e.hesap_adi || '',
    kategori:       e.kategori,
    beyanname_turu: e.beyanname_turu,
    onaylandi:      e.onaylandi !== false  // default: true
  }));

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .upsert(rows, { onConflict: 'user_id,mukellef_ad,hesap_kodu' });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, kaydedilen: rows.length });
});

// DELETE /api/hesap-plani/:mukellefAd
// Bir mükellefin tüm eşlemelerini sıfırla (yeniden eşleme için)
router.delete('/:mukellefAd', async (req, res) => {
  const mukellef_ad = decodeURIComponent(req.params.mukellefAd);

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .delete()
    .eq('user_id', req.user.id)
    .eq('mukellef_ad', mukellef_ad);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
