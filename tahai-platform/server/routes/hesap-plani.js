// Hesap Planı Eşleştirme Route'ları
// Mükellef bazlı hesap kodu → beyanname kategorisi eşlemesini Supabase'de saklar
// Geriye uyumlu: hem UUID (mukellef_id) hem mükellef adı (text) kabul eder

const express  = require('express');
const supabase = require('../config/supabase');
const auth     = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// UUID formatı kontrolü
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Mükellef adından ID çözümle (geriye uyumluluk)
async function resolveMukellefId(paramValue, userId) {
  if (isUUID(paramValue)) return paramValue;

  // Mükellef adı ile ara
  const ad = decodeURIComponent(paramValue);
  const { data } = await supabase
    .from('mukellefler')
    .select('id')
    .eq('user_id', userId)
    .ilike('ad', ad)
    .limit(1)
    .single();

  return data ? data.id : null;
}

// GET /api/hesap-plani/:mukellefIdOrAd
router.get('/:mukellefIdOrAd', async (req, res) => {
  const mukellef_id = await resolveMukellefId(req.params.mukellefIdOrAd, req.user.id);

  if (!mukellef_id) {
    // Mükellef bulunamadı — boş dön (hata değil, henüz kayıt yok)
    return res.json({ eslesmeler: [] });
  }

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id)
    .eq('onaylandi', true);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// GET /api/hesap-plani/:mukellefIdOrAd/tumu
router.get('/:mukellefIdOrAd/tumu', async (req, res) => {
  const mukellef_id = await resolveMukellefId(req.params.mukellefIdOrAd, req.user.id);

  if (!mukellef_id) {
    return res.json({ eslesmeler: [] });
  }

  const { data, error } = await supabase
    .from('hesap_plani_esleme')
    .select('hesap_kodu, hesap_adi, kategori, beyanname_turu, onaylandi')
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ eslesmeler: data || [] });
});

// POST /api/hesap-plani
router.post('/', async (req, res) => {
  let { mukellef_id, mukellef_ad, eslesmeler } = req.body;

  if (!eslesmeler || !Array.isArray(eslesmeler) || eslesmeler.length === 0) {
    return res.status(400).json({ error: 'eslesmeler zorunlu' });
  }

  // mukellef_id veya mukellef_ad'dan çözümle
  if (mukellef_id && !isUUID(mukellef_id)) {
    // Eski format: mukellef_id aslında ad olarak gönderilmiş
    mukellef_ad = mukellef_id;
    mukellef_id = null;
  }

  if (!mukellef_id && mukellef_ad) {
    const resolved = await resolveMukellefId(mukellef_ad, req.user.id);
    if (!resolved) {
      return res.status(404).json({ error: 'Mükellef bulunamadı: ' + mukellef_ad });
    }
    mukellef_id = resolved;
  }

  if (!mukellef_id) {
    return res.status(400).json({ error: 'mukellef_id veya mukellef_ad zorunlu' });
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
    onaylandi:      e.onaylandi !== false
  }));

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .upsert(rows, { onConflict: 'user_id,mukellef_id,hesap_kodu' });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, kaydedilen: rows.length });
});

// DELETE /api/hesap-plani/:mukellefIdOrAd
router.delete('/:mukellefIdOrAd', async (req, res) => {
  const mukellef_id = await resolveMukellefId(req.params.mukellefIdOrAd, req.user.id);

  if (!mukellef_id) {
    return res.json({ success: true }); // yoksa zaten silinecek bir şey yok
  }

  const { error } = await supabase
    .from('hesap_plani_esleme')
    .delete()
    .eq('user_id', req.user.id)
    .eq('mukellef_id', mukellef_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
