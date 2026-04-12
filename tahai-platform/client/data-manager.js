/**
 * TahAI Data Manager v1.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Merkezi veri katmanı. Tüm CRUD işlemleri bu dosyadaki fonksiyonlar
 * aracılığıyla yapılır. Her fonksiyon /api/* route'larını çağırır.
 *
 * Bağımlılıklar: tahai-api.js (_tFetch, _tHeaders, _API_BASE)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════
// YARDIMCI
// ═══════════════════════════════════════════════════════════════

async function _dmFetch(path, opts) {
  // _tFetch zaten JWT ekliyor ve 401 yönetimi yapıyor
  return _tFetch(path, opts);
}

// ═══════════════════════════════════════════════════════════════
// MÜKELLEFLER
// ═══════════════════════════════════════════════════════════════

async function mukellefleriGetir() {
  try {
    const res = await _dmFetch('/api/mukellef');
    return res.mukellefler || [];
  } catch (e) {
    console.error('[DM] mukellefleriGetir hata:', e.message);
    return [];
  }
}

async function mukellefEkle(mukellefData) {
  const res = await _dmFetch('/api/mukellef', {
    method: 'POST',
    body: JSON.stringify(mukellefData)
  });
  return res.mukellef;
}

async function mukellefGuncelle(id, mukellefData) {
  const res = await _dmFetch('/api/mukellef/' + id, {
    method: 'PUT',
    body: JSON.stringify(mukellefData)
  });
  return res.mukellef;
}

async function mukellefSil(id) {
  await _dmFetch('/api/mukellef/' + id, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// MİZANLAR
// ═══════════════════════════════════════════════════════════════

async function mizanKaydet(mukellefId, mizanData) {
  // mizanData: { donem, tarih_araligi, firma_adi, satirlar, anomali_raporu,
  //              hesap_ozeti, ters_bakiyeler, dosya_adi }
  const res = await _dmFetch('/api/mizan', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...mizanData
    })
  });
  return res.mizan;
}

async function mizanGetir(mukellefId, mizanId) {
  try {
    const res = await _dmFetch('/api/mizan/' + mukellefId + '/' + mizanId);
    return res.mizan || null;
  } catch (e) {
    console.error('[DM] mizanGetir hata:', e.message);
    return null;
  }
}

async function mukellefMizanlariGetir(mukellefId) {
  try {
    const res = await _dmFetch('/api/mizan/' + mukellefId);
    return res.mizanlar || [];
  } catch (e) {
    console.error('[DM] mukellefMizanlariGetir hata:', e.message);
    return [];
  }
}

async function mizanSil(mizanId) {
  await _dmFetch('/api/mizan/' + mizanId, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// HESAP PLANI EŞLEMESİ
// ═══════════════════════════════════════════════════════════════

async function hesapEslemeGetir(mukellefId) {
  try {
    const res = await _dmFetch('/api/hesap-plani/' + mukellefId);
    return res.eslesmeler || [];
  } catch (e) {
    console.error('[DM] hesapEslemeGetir hata:', e.message);
    return [];
  }
}

async function hesapEslemeTumuGetir(mukellefId) {
  try {
    const res = await _dmFetch('/api/hesap-plani/' + mukellefId + '/tumu');
    return res.eslesmeler || [];
  } catch (e) {
    console.error('[DM] hesapEslemeTumuGetir hata:', e.message);
    return [];
  }
}

async function hesapEslemeKaydet(mukellefId, eslesmeler) {
  // eslesmeler: [{ hesap_kodu, hesap_adi, kategori, beyanname_turu, onaylandi }]
  const res = await _dmFetch('/api/hesap-plani', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      eslesmeler
    })
  });
  return res;
}

async function hesapEslemeSil(mukellefId) {
  await _dmFetch('/api/hesap-plani/' + mukellefId, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// FİŞLER
// ═══════════════════════════════════════════════════════════════

async function fisKaydet(mukellefId, fisData) {
  // Tek fiş kaydet
  const res = await _dmFetch('/api/fis', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...fisData
    })
  });
  return res.fis;
}

async function fislerTopluKaydet(mukellefId, fisler) {
  // Birden fazla fiş kaydet
  const res = await _dmFetch('/api/fis/bulk', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      fisler
    })
  });
  return res.fisler || [];
}

async function fisleriGetir(mukellefId, donem) {
  try {
    let url = '/api/fis/' + mukellefId;
    if (donem) url += '?donem=' + encodeURIComponent(donem);
    const res = await _dmFetch(url);
    return res.fisler || [];
  } catch (e) {
    console.error('[DM] fisleriGetir hata:', e.message);
    return [];
  }
}

async function fisSil(fisId) {
  await _dmFetch('/api/fis/' + fisId, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// FATURALAR
// ═══════════════════════════════════════════════════════════════

async function faturaKaydet(mukellefId, faturaData) {
  const res = await _dmFetch('/api/fatura', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...faturaData
    })
  });
  return res.fatura;
}

async function faturalarTopluKaydet(mukellefId, faturalar) {
  const res = await _dmFetch('/api/fatura/bulk', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      faturalar
    })
  });
  return res.faturalar || [];
}

async function faturalariGetir(mukellefId, donem, tur) {
  try {
    let url = '/api/fatura/' + mukellefId;
    const params = [];
    if (donem) params.push('donem=' + encodeURIComponent(donem));
    if (tur) params.push('tur=' + encodeURIComponent(tur));
    if (params.length) url += '?' + params.join('&');
    const res = await _dmFetch(url);
    return res.faturalar || [];
  } catch (e) {
    console.error('[DM] faturalariGetir hata:', e.message);
    return [];
  }
}

async function faturaSil(faturaId) {
  await _dmFetch('/api/fatura/' + faturaId, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// Z RAPORLARI
// ═══════════════════════════════════════════════════════════════

async function zRaporlariGetir(mukellefId, donem) {
  try {
    let url = '/api/z-raporu/' + mukellefId;
    if (donem) url += '?donem=' + encodeURIComponent(donem);
    const res = await _dmFetch(url);
    return res.z_raporlari || [];
  } catch (e) {
    console.error('[DM] zRaporlariGetir hata:', e.message);
    return [];
  }
}

async function zRaporuKaydet(mukellefId, zData) {
  const res = await _dmFetch('/api/z-raporu', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...zData
    })
  });
  return res.z_raporu;
}

async function zRaporuSil(zId) {
  await _dmFetch('/api/z-raporu/' + zId, { method: 'DELETE' });
  return true;
}

// ═══════════════════════════════════════════════════════════════
// KONTROL SONUÇLARI
// ═══════════════════════════════════════════════════════════════

async function kontrolSonucuKaydet(mukellefId, sonucData) {
  // sonucData: { donem, kontrol_turu, sonuc_data, risk_skoru }
  const res = await _dmFetch('/api/kontrol-sonuclari', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...sonucData
    })
  });
  return res.sonuc;
}

async function kontrolSonuclariniGetir(mukellefId, donem, kontrolTuru) {
  try {
    let url = '/api/kontrol-sonuclari/' + mukellefId;
    const params = [];
    if (donem) params.push('donem=' + encodeURIComponent(donem));
    if (kontrolTuru) params.push('kontrol_turu=' + encodeURIComponent(kontrolTuru));
    if (params.length) url += '?' + params.join('&');
    const res = await _dmFetch(url);
    return res.sonuclar || [];
  } catch (e) {
    console.error('[DM] kontrolSonuclariniGetir hata:', e.message);
    return [];
  }
}

// ── Fatura Mutabakat helper'ları (AI KDV Mutabakat için) ─────
// Tüm fatura mutabakat kayıtlarını getir
async function faturaMutabakatlariniGetir(mukellefId) {
  const kayitlar = await kontrolSonuclariniGetir(mukellefId, null, 'fatura_mutabakat');
  return Array.isArray(kayitlar) ? kayitlar : [];
}

// En son satış mutabakatını getir (sonuc_data.mutabakat_turu === 'satis')
async function sonSatisMutabakatiGetir(mukellefId) {
  const tum = await faturaMutabakatlariniGetir(mukellefId);
  const satis = tum.filter(k => k.sonuc_data && k.sonuc_data.mutabakat_turu === 'satis');
  if (satis.length === 0) return null;
  return satis.sort((a, b) => {
    const ta = new Date((a.sonuc_data && a.sonuc_data.kayit_tarihi) || a.olusturma || 0).getTime();
    const tb = new Date((b.sonuc_data && b.sonuc_data.kayit_tarihi) || b.olusturma || 0).getTime();
    return tb - ta;
  })[0];
}

// En son alış mutabakatını getir (sonuc_data.mutabakat_turu === 'alis')
async function sonAlisMutabakatiGetir(mukellefId) {
  const tum = await faturaMutabakatlariniGetir(mukellefId);
  const alis = tum.filter(k => k.sonuc_data && k.sonuc_data.mutabakat_turu === 'alis');
  if (alis.length === 0) return null;
  return alis.sort((a, b) => {
    const ta = new Date((a.sonuc_data && a.sonuc_data.kayit_tarihi) || a.olusturma || 0).getTime();
    const tb = new Date((b.sonuc_data && b.sonuc_data.kayit_tarihi) || b.olusturma || 0).getTime();
    return tb - ta;
  })[0];
}

// ── Otomatik Kaydet/Yükle helper'ları ────────────────────────
// Genel amaçlı: en son kaydı tür bazlı getir (kontrol_turu filtresi)
async function _sonKontrolSonucGetir(mukellefId, kontrolTuru) {
  try {
    const liste = await kontrolSonuclariniGetir(mukellefId, null, kontrolTuru);
    if (!Array.isArray(liste) || liste.length === 0) return null;
    // En yeni önce (olusturma DESC olarak dönüyor, yine de sıralayalım)
    return liste.sort((a, b) => {
      const ta = new Date(a.olusturma || 0).getTime();
      const tb = new Date(b.olusturma || 0).getTime();
      return tb - ta;
    })[0];
  } catch(e) {
    console.warn('[DM] _sonKontrolSonucGetir hata:', e.message);
    return null;
  }
}

async function sonMizanGetir(mukellefId) {
  try {
    const liste = await mukellefMizanlariGetir(mukellefId);
    if (!Array.isArray(liste) || liste.length === 0) return null;
    return liste[0]; // API zaten created_at DESC dönüyor
  } catch(e) { return null; }
}

async function sonBeyannameKontrolGetir(mukellefId) {
  return _sonKontrolSonucGetir(mukellefId, 'beyanname_kontrol');
}

async function sonDonemKapanisGetir(mukellefId) {
  try {
    const liste = await donemKapanisGetir(mukellefId);
    if (!Array.isArray(liste) || liste.length === 0) return null;
    return liste[0]; // API created_at DESC / guncelleme
  } catch(e) { return null; }
}

async function sonRiskRaporuGetir(mukellefId) {
  return _sonKontrolSonucGetir(mukellefId, 'risk_raporu');
}

async function sonHesaplamaGetir(mukellefId) {
  return _sonKontrolSonucGetir(mukellefId, 'hesaplama');
}

// Genel fatura mutabakat (satış + alış birleşik, en son hangisi)
async function sonFaturaMutabakatiGetir(mukellefId) {
  try {
    const [sat, ali] = await Promise.all([
      sonSatisMutabakatiGetir(mukellefId),
      sonAlisMutabakatiGetir(mukellefId)
    ]);
    if (!sat && !ali) return null;
    if (!sat) return ali;
    if (!ali) return sat;
    const ts = new Date(sat.olusturma || 0).getTime();
    const ta = new Date(ali.olusturma || 0).getTime();
    return ts > ta ? sat : ali;
  } catch(e) { return null; }
}

// ═══════════════════════════════════════════════════════════════
// DÖNEM KAPANIŞ
// ═══════════════════════════════════════════════════════════════

async function donemKapanisKaydet(mukellefId, kapanisData) {
  // kapanisData: { donem, checklist, tamamlanma_yuzdesi }
  const res = await _dmFetch('/api/donem-kapanis', {
    method: 'POST',
    body: JSON.stringify({
      mukellef_id: mukellefId,
      ...kapanisData
    })
  });
  return res.kapanis;
}

async function donemKapanisGetir(mukellefId, donem) {
  try {
    let url = '/api/donem-kapanis/' + mukellefId;
    if (donem) url += '?donem=' + encodeURIComponent(donem);
    const res = await _dmFetch(url);
    return res.kapanislar || [];
  } catch (e) {
    console.error('[DM] donemKapanisGetir hata:', e.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// MÜKELLEF ÖZETİ (Dashboard kartları için)
// ═══════════════════════════════════════════════════════════════

async function mukellefOzetiGetir(mukellefId) {
  try {
    const [mizanlar, fisler, faturalar, sonuclar] = await Promise.all([
      mukellefMizanlariGetir(mukellefId),
      fisleriGetir(mukellefId),
      faturalariGetir(mukellefId),
      kontrolSonuclariniGetir(mukellefId)
    ]);

    const sonMizan = mizanlar.length > 0 ? mizanlar[0] : null;
    const sonKontrol = sonuclar.length > 0 ? sonuclar[0] : null;

    return {
      mizanSayisi: mizanlar.length,
      fisSayisi: fisler.length,
      faturaSayisi: faturalar.length,
      kontrolSayisi: sonuclar.length,
      sonMizan,
      sonKontrol,
      sonRiskSkoru: sonKontrol ? sonKontrol.risk_skoru : null
    };
  } catch (e) {
    console.error('[DM] mukellefOzetiGetir hata:', e.message);
    return {
      mizanSayisi: 0, fisSayisi: 0, faturaSayisi: 0,
      kontrolSayisi: 0, sonMizan: null, sonKontrol: null, sonRiskSkoru: null
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// SYNC SNAPSHOT (Geriye uyumluluk — geçiş döneminde kullanılır)
// ═══════════════════════════════════════════════════════════════

async function dmCloudLoad() {
  try {
    const res = await _dmFetch('/api/sync/snapshot');
    return res;
  } catch (e) {
    console.error('[DM] cloudLoad hata:', e.message);
    return null;
  }
}

async function dmCloudSave(snapshot) {
  try {
    const res = await _dmFetch('/api/sync/snapshot', {
      method: 'POST',
      body: JSON.stringify(snapshot)
    });
    return res;
  } catch (e) {
    console.error('[DM] cloudSave hata:', e.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MIGRATION: localStorage → Supabase
// ═══════════════════════════════════════════════════════════════

// Eski localStorage verisinin varlığını kontrol et
function _migrationGerekliMi() {
  const uid = (() => { try { return JSON.parse(localStorage.getItem('tahai_user') || '{}').id || ''; } catch(e) { return ''; } })();
  const prefix = uid ? 'u_' + uid + '_' : '';

  // Kontrol et: mükellef listesi localStorage'da var mı?
  const mukellefRaw = localStorage.getItem(prefix + 'luca_mukellef');
  if (!mukellefRaw) return false;
  try {
    const arr = JSON.parse(mukellefRaw);
    return Array.isArray(arr) && arr.length > 0;
  } catch(e) { return false; }
}

// Migration durumunu kontrol et
function _migrationYapildiMi() {
  return localStorage.getItem('tahai_migration_v1_done') === 'true';
}

// Ana migration fonksiyonu
async function localStorageMigration() {
  if (_migrationYapildiMi() || !_migrationGerekliMi()) return false;

  console.log('[Migration] Eski localStorage verisi tespit edildi...');

  const uid = (() => { try { return JSON.parse(localStorage.getItem('tahai_user') || '{}').id || ''; } catch(e) { return ''; } })();
  const sk = (key) => uid ? 'u_' + uid + '_' + key : key;

  let migrated = { mukellef: 0, mizan: 0, fis: 0, fatura: 0, dk: 0, hp: 0 };

  try {
    // 1. Mükellef listesini çek
    const mukellefListeRaw = localStorage.getItem(sk('luca_mukellef'));
    const mukellefListe = mukellefListeRaw ? JSON.parse(mukellefListeRaw) : [];

    // Mükellef kartlarını da çek (detaylı bilgi için)
    const kartlarRaw = localStorage.getItem(sk('tahai_kartlar'));
    const kartlar = kartlarRaw ? JSON.parse(kartlarRaw) : [];

    // Supabase'de zaten olan mükellefleri çek
    const mevcutMukellefler = await mukellefleriGetir();
    const mevcutAdlar = new Set(mevcutMukellefler.map(m => m.ad.toLowerCase()));

    // Yeni mükellefleri ekle
    for (const ad of mukellefListe) {
      if (typeof ad !== 'string' || !ad.trim()) continue;
      if (mevcutAdlar.has(ad.toLowerCase())) continue;

      // Kart bilgisi var mı?
      const kart = kartlar.find(k => k && k.ad && k.ad.toLowerCase() === ad.toLowerCase());
      try {
        await mukellefEkle({
          ad: ad,
          vkn: kart?.vkn || '',
          vergi_dairesi: kart?.vd || '',
          tur: kart?.tur || '',
          adres: kart?.adres || '',
          tel: kart?.tel || '',
          email: kart?.eposta || '',
          not: kart?.not || '',
          kdv_periyot: kart?.kdv_periyot || 'aylik'
        });
        migrated.mukellef++;
      } catch(e) { console.warn('[Migration] Mükellef eklenemedi:', ad, e.message); }
    }

    // UUID cache'i yenile
    _mukellefIdCache = {};
    const guncelMukellefler = await mukellefleriGetir();
    guncelMukellefler.forEach(m => { _mukellefIdCache[m.ad] = m.id; });

    // 2. Her mükellef için arşiv verilerini migrate et
    for (const m of guncelMukellefler) {
      const mukId = m.id;
      const ad = m.ad;

      // Mizan arşivi
      try {
        const mizanKey = sk('tahai_mizan_' + ad);
        const mizanArsiv = JSON.parse(localStorage.getItem(mizanKey) || '[]');
        for (const miz of mizanArsiv) {
          try {
            await mizanKaydet(mukId, {
              donem: miz.donem || '',
              firma_adi: miz.firma || '',
              satirlar: miz.satirlar || [],
              dosya_adi: miz.dosya || ''
            });
            migrated.mizan++;
          } catch(e) { /* aynı dönem varsa upsert, hata normal */ }
        }
      } catch(e) {}

      // Fiş arşivi
      try {
        const fisKey = sk('tahai_fis_arsiv_' + ad);
        const fisArsiv = JSON.parse(localStorage.getItem(fisKey) || '[]');
        if (fisArsiv.length > 0) {
          const apiFisler = fisArsiv.map(f => ({
            tarih: f.tarih || '', fis_turu: f.fis_turu || f.tur || '',
            satici: f.satici || '', kdv_orani: f.kdv_orani || 0,
            matrah: f.matrah || 0, kdv_tutari: f.kdv_tutari || f.kdv || 0,
            toplam: f.toplam || 0, donem: (f.tarih || '').slice(0, 7),
            hesap_kodu: f.muhasebe_kodu || f.hesap_kodu || ''
          }));
          try {
            await fislerTopluKaydet(mukId, apiFisler);
            migrated.fis += apiFisler.length;
          } catch(e) {}
        }
      } catch(e) {}

      // Fatura arşivi
      try {
        const faturaKey = sk('tahai_fatura_arsiv_' + ad);
        const faturaArsiv = JSON.parse(localStorage.getItem(faturaKey) || '[]');
        if (faturaArsiv.length > 0) {
          const apiFaturalar = faturaArsiv.map(f => ({
            tarih: f.tarih || '', tur: f.fatura_turu || 'alis',
            belge_no: f.fatura_no || '', satici_alici: f.firma || '',
            vkn: f.vkn_tckn || '', kdv_orani: f.kdv_orani || 0,
            matrah: f.matrah || 0, kdv_tutari: f.kdv || 0,
            toplam: f.toplam || 0, donem: (f.tarih || '').slice(0, 7),
            kaynak: 'migration'
          }));
          try {
            await faturalarTopluKaydet(mukId, apiFaturalar);
            migrated.fatura += apiFaturalar.length;
          } catch(e) {}
        }
      } catch(e) {}

      // Hesap kodları
      try {
        const hpKey = sk('tahai_hesap_kodlari_' + ad);
        const hpData = JSON.parse(localStorage.getItem(hpKey) || '{}');
        if (hpData.ai_esleme) {
          const eslesmeler = Object.entries(hpData.ai_esleme).map(([kat, kod]) => ({
            hesap_kodu: kod, hesap_adi: kat, kategori: kat,
            beyanname_turu: 'genel', onaylandi: true
          }));
          try {
            await hesapEslemeKaydet(mukId, eslesmeler);
            migrated.hp += eslesmeler.length;
          } catch(e) {}
        }
      } catch(e) {}
    }

    // Migration tamamlandı işaretle
    localStorage.setItem('tahai_migration_v1_done', 'true');
    console.log('[Migration] Tamamlandı:', migrated);
    return migrated;

  } catch(e) {
    console.error('[Migration] Genel hata:', e.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// INIT LOG
// ═══════════════════════════════════════════════════════════════
console.log('[DataManager] v1.2 yüklendi — ' + Object.keys({
  mukellefleriGetir, mukellefEkle, mukellefGuncelle, mukellefSil,
  mizanKaydet, mizanGetir, mukellefMizanlariGetir, mizanSil,
  hesapEslemeGetir, hesapEslemeTumuGetir, hesapEslemeKaydet, hesapEslemeSil,
  fisKaydet, fislerTopluKaydet, fisleriGetir, fisSil,
  faturaKaydet, faturalarTopluKaydet, faturalariGetir, faturaSil,
  zRaporlariGetir, zRaporuKaydet, zRaporuSil,
  kontrolSonucuKaydet, kontrolSonuclariniGetir,
  faturaMutabakatlariniGetir, sonSatisMutabakatiGetir, sonAlisMutabakatiGetir,
  sonMizanGetir, sonBeyannameKontrolGetir, sonDonemKapanisGetir,
  sonRiskRaporuGetir, sonHesaplamaGetir, sonFaturaMutabakatiGetir,
  donemKapanisKaydet, donemKapanisGetir,
  mukellefOzetiGetir, dmCloudLoad, dmCloudSave
}).length + ' fonksiyon hazır');
