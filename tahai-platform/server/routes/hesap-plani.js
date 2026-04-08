// Hesap Planı Eşleştirme Route'ları
// Mükellef bazlı hesap kodu → beyanname kategorisi eşlemesini Supabase'de saklar

const express  = require('express');
const supabase = require('../config/supabase');
const auth     = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/hesap-plani/:mukellefId
// Bir mükellefe ait onaylanmış eşlemeleri çek (UUID bazlı)
router.get('/:mukellefId', async (req, res) => {
  const mukellef_id = req.params.mukellefId;

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id)
    .eq('onaylandi', true);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// GET /api/hesap-plani/:mukellefId/tumu
// Tüm eşlemeleri çek (onaysızlar dahil — modal için)
router.get('/:mukellefId/tumu', async (req, res) => {
  const mukellef_id = req.params.mukellefId;

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu, onaylandi')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// POST /api/hesap-plani
// Eşlemeleri kaydet (upsert — çakışınca güncelle)
router.post('/', async (req, res) => {
  const { mukellef_id, eslesmeler } = req.body;

  if (!mukellef_id || !Array.isArray(eslesmeler) || eslesmeler.length === 0) {
    return res.status(400).json({ error: 'mukellef_id ve eslesmeler zorunlu' });
  }

  // Mükellef sahiplik kontrolü
  const { data: mukellef } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('id', mukellef_id)
    .eq('user_id', req.user.id)
    .single();

  if (!mukellef) return res.status(403).json({ error: 'Bu mükellefe erişim yetkiniz yok' });

  const rows = eslesmeler.map(e => ({
    user_id:        req.user.id,
    mukellef_id,
    hesap_kodu:     e.hesap_kodu,
    hesap_adi:      e.hesap_adi || '',
    kategori:       e.kategori,
    beyanname_turu: e.beyanname_turu,
    onaylandi:      e.onaylandi !== false  // default: true
  }));

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .upsert(rows, { onConflict: 'user_id,mukellef_id,hesap_kodu' });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, kaydedilen: rows.length });
});

// DELETE /api/hesap-plani/:mukellefId
// Bir mükellefin tüm eşlemelerini sıfırla (yeniden eşleme için)
router.delete('/:mukellefId', async (req, res) => {
  const mukellef_id = req.params.mukellefId;

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .delete()
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
