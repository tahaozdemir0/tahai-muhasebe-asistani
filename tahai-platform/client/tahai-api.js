/**
 * TahAI Backend Bridge v1.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Bu dosya, HTML'deki 4 kritik fonksiyonu backend API kullanacak şekilde
 * override eder. Backend kapalıysa veya token yoksa orijinal yönteme (localStorage
 * + doğrudan Anthropic API) otomatik olarak geri döner.
 *
 * Override edilen fonksiyonlar: callClaude · doLogin · cloudSave · cloudLoad
 *
 * Nasıl çalışır:
 *   HTML'in ana <script> bloğu kapandıktan SONRA bu dosya yüklenir.
 *   JS'de aynı isimli function declaration'lar ezildiği için bu dosyadaki
 *   tanımlar kazanır.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// window.TAHAI_API_BASE yoksa default olarak port 3001
const _API_BASE = (typeof window !== 'undefined' && window.TAHAI_API_BASE)
  ? window.TAHAI_API_BASE
  : 'http://localhost:3001';

// /giris sayfasından gelen JWT token'ı sessionStorage'a aktar
(function() {
  const lsToken = localStorage.getItem('tahai_token');
  if (lsToken && !sessionStorage.getItem('_jwt')) {
    sessionStorage.setItem('_jwt', lsToken);
    const user = JSON.parse(localStorage.getItem('tahai_user') || '{}');
    sessionStorage.setItem('_su', user.ad || user.kullanici_adi || user.email || '');
  }
})();

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────

function _tJwt() {
  return sessionStorage.getItem('_jwt') || null;
}

function _tHeaders(extra) {
  const h = { 'Content-Type': 'application/json' };
  const tok = _tJwt();
  if (tok) h['Authorization'] = 'Bearer ' + tok;
  return Object.assign(h, extra || {});
}

async function _tFetch(path, opts) {
  opts = opts || {};
  const resp = await fetch(_API_BASE + path, {
    ...opts,
    headers: _tHeaders(opts.headers)
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: resp.statusText }));
    // Token süresi dolmuşsa çıkış yap ve login'e yönlendir
    if (resp.status === 401) {
      sessionStorage.removeItem('_jwt');
      sessionStorage.removeItem('_st');
      localStorage.removeItem('tahai_token');
      localStorage.removeItem('tahai_user');
      const authErr = new Error('AUTH_EXPIRED');
      authErr.isAuthError = true;
      throw authErr;
    }
    throw new Error(err.error || 'API hatası (' + resp.status + ')');
  }
  return resp.json();
}

async function _backendOnline() {
  try {
    const resp = await fetch(_API_BASE + '/api/health', { signal: AbortSignal.timeout(2000) });
    return resp.ok;
  } catch {
    return false;
  }
}

// ─── 1. callClaude — Claude API Proxy ────────────────────────────────────────
// JWT token varsa → backend proxy (API key tarayıcıdan çıkar)
// Yoksa → eski doğrudan Anthropic çağrısı (orijinal davranış)

async function callClaude(prompt, imageFile, retry) {
  if (retry === undefined) retry = true;

  const token = _tJwt();

  if (token) {
    try {
      let imageData = null;
      if (imageFile) {
        const b64 = await fileToBase64(imageFile);
        const mt  = getMediaType(imageFile);
        imageData = { data: b64, mediaType: mt };
      }

      // API key sunucu tarafında .env'den alınır — frontend'den gönderilmez
      const body = { prompt, image: imageData };

      const data = await _tFetch('/api/claude', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      return data.text;

    } catch (e) {
      // Token süresi dolmuş — direkt API'ye düşme, login'e yönlendir
      if (e.isAuthError) {
        if (typeof _showApp === 'function') {
          if (typeof logout === 'function') logout();
        }
        window.location.href = '/giris';
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      if (retry) {
        await new Promise(r => setTimeout(r, 1500));
        return callClaude(prompt, imageFile, false);
      }
      // Backend başarısız — gerçek hatayı fırlat, fallback yok
      throw new Error('AI bağlantı hatası: ' + e.message);
    }
  }

  // Token yoksa giriş yap
  throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');

  const content = [];
  if (imageFile) {
    const b64 = await fileToBase64(imageFile);
    const mt  = getMediaType(imageFile);
    if (mt === 'application/pdf') {
      content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } });
    } else {
      content.push({ type: 'image', source: { type: 'base64', media_type: mt, data: b64 } });
    }
  }
  content.push({ type: 'text', text: prompt });

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content }] })
  });

  if (!resp.ok) {
    const err = await resp.json();
    if (retry) {
      await new Promise(r => setTimeout(r, 1500));
      return callClaude(prompt, imageFile, false);
    }
    throw new Error(err.error?.message || 'API hatası');
  }

  const data = await resp.json();
  return data.content.map(c => c.text || '').join('');
}

// ─── 2. doLogin — JWT Auth + Fallback ────────────────────────────────────────
// Backend açıksa → JWT token al
// Backend kapalıysa → eski hash-based auth (değişiklik yok)

async function doLogin() {
  const userInput = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass      = document.getElementById('loginPass').value;
  const errEl     = document.getElementById('loginError');
  const btn       = document.querySelector('#loginOverlay button');
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }

  try {
    // Backend auth
    let backendOk = false;
    if (await _backendOnline()) {
      // Önce direkt email olarak dene, sonra @tahai.local ekleyerek dene
      const emailCandidates = userInput.includes('@')
        ? [userInput]
        : [userInput, userInput + '@tahai.local'];

      for (const emailTry of emailCandidates) {
        try {
          const data = await _tFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: emailTry, password: pass })
          });
          sessionStorage.setItem('_jwt', data.token);
          sessionStorage.setItem('_su',  data.user.ad || data.user.kullanici_adi || userInput);
          localStorage.setItem('tahai_token', data.token);
          localStorage.setItem('tahai_user', JSON.stringify(data.user));
          backendOk = true;
          break;
        } catch (e) {
          console.info('[TahAPI] Backend auth deneme:', emailTry, e.message);
        }
      }
    }

    if (backendOk) {
      if (typeof _showApp === 'function') _showApp();
      else document.getElementById('loginOverlay').style.display = 'none';
      errEl.style.display = 'none';
      setTimeout(() => cloudLoad().catch(() => {}), 300);
      return;
    }

    // Backend kapalı veya giriş başarısız
    await new Promise(r => setTimeout(r, 1000));
    errEl.style.display = 'block';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass').focus();
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Giriş Yap'; }
  }
}

// ─── 3. cloudSave — Backend Sync + Fallback ───────────────────────────────────
// JWT varsa → /api/sync/snapshot (backend Supabase'e yazar)
// Yoksa → eski doğrudan Supabase blob upsert

async function cloudSave() {
  const kullanici = sessionStorage.getItem('_su') || 'taha';
  const token     = _tJwt();

  if (token) {
    try {
      await _tFetch('/api/sync/snapshot', {
        method: 'POST',
        body: JSON.stringify({
          fis_data:    typeof fisData     !== 'undefined' ? fisData     : [],
          z_data:      typeof zData       !== 'undefined' ? zData       : [],
          fatura_data: typeof faturaData  !== 'undefined' ? faturaData  : [],
          mukellefler: typeof mukellefler !== 'undefined' ? mukellefler : []
        })
      });
      const el = document.getElementById('cloudStatus');
      if (el) el.textContent = '☁️ ' + new Date().toLocaleTimeString('tr-TR');
      return true;
    } catch (e) {
      console.warn('[TahAPI] Backend sync başarısız, eski yönteme dönülüyor:', e.message);
    }
  }

  // ─── Fallback: orijinal Supabase blob ────────────────────────────────────
  try {
    await sbUpsert('kullanici_verileri', {
      kullanici,
      fis_data:    JSON.stringify(typeof fisData     !== 'undefined' ? fisData     : []),
      z_data:      JSON.stringify(typeof zData       !== 'undefined' ? zData       : []),
      fatura_data: JSON.stringify(typeof faturaData  !== 'undefined' ? faturaData  : []),
      mukellef:    JSON.stringify(typeof mukellefler !== 'undefined' ? mukellefler : []),
      fatura_arsiv: localStorage.getItem('luca_fatura_arsiv') || '{}',
      guncelleme:  new Date().toISOString()
    });
    const el = document.getElementById('cloudStatus');
    if (el) el.textContent = '☁️ ' + new Date().toLocaleTimeString('tr-TR');
    return true;
  } catch (e) {
    console.warn('[CloudSave]', e.message);
    return false;
  }
}

// ─── 4. cloudLoad — Backend Sync + Fallback ───────────────────────────────────
// JWT varsa → /api/sync/snapshot (hem legacy hem yeni tablodan okur)
// Yoksa → eski doğrudan Supabase sorgusu

async function cloudLoad() {
  const kullanici = sessionStorage.getItem('_su') || 'taha';
  const token     = _tJwt();

  if (token) {
    try {
      const v = await _tFetch('/api/sync/snapshot');

      if (v.fis_data    && v.fis_data.length > 0)    { if (typeof fisData !== 'undefined')     { fisData     = v.fis_data;    renderFisTable();     } }
      if (v.z_data      && v.z_data.length > 0)      { if (typeof zData !== 'undefined')       { zData       = v.z_data;      renderZTable();       } }
      if (v.fatura_data && v.fatura_data.length > 0) { if (typeof faturaData !== 'undefined')  { faturaData  = v.fatura_data; renderFaturaTable?.(); } }
      if (v.mukellefler && v.mukellefler.length > 0) { if (typeof mukellefler !== 'undefined') { mukellefler = v.mukellefler; renderMukellefler();  } }

      const statFis = document.getElementById('statFis');
      const statZ   = document.getElementById('statZ');
      if (statFis) statFis.textContent = (typeof fisData !== 'undefined' ? fisData : []).length;
      if (statZ)   statZ.textContent   = (typeof zData   !== 'undefined' ? zData   : []).length;

      if (typeof showNotif === 'function') showNotif('☁️ Veriler buluttan yüklendi!', 'success');
      return true;
    } catch (e) {
      console.info('[TahAPI] Backend load başarısız, eski yönteme dönülüyor:', e.message);
    }
  }

  // ─── Fallback: orijinal Supabase sorgusu ─────────────────────────────────
  try {
    const rows = await sbGet('kullanici_verileri', `kullanici=eq.${kullanici}&limit=1`);
    if (!rows || rows.length === 0) return false;
    const v = rows[0];

    if (v.fis_data    && typeof fisData     !== 'undefined') { fisData     = JSON.parse(v.fis_data);    renderFisTable();     }
    if (v.z_data      && typeof zData       !== 'undefined') { zData       = JSON.parse(v.z_data);      renderZTable();       }
    if (v.fatura_data && typeof faturaData  !== 'undefined') { faturaData  = JSON.parse(v.fatura_data); renderFaturaTable?.(); }
    if (v.mukellef    && typeof mukellefler !== 'undefined') { mukellefler = JSON.parse(v.mukellef);    renderMukellefler();  }
    if (v.fatura_arsiv) localStorage.setItem(typeof _sk === 'function' ? _sk('luca_fatura_arsiv') : 'luca_fatura_arsiv', v.fatura_arsiv);
    if (v.api_key_enc) {
      localStorage.setItem(typeof _sk === 'function' ? _sk('_lk') : '_lk', v.api_key_enc);
      if (typeof _loadApiKey === 'function') {
        if (typeof apiKey !== 'undefined') apiKey = _loadApiKey();
        const el = document.getElementById('apiKey');
        if (el && apiKey) el.value = '●'.repeat(16) + apiKey.slice(-4);
      }
    }

    const statFis = document.getElementById('statFis');
    const statZ   = document.getElementById('statZ');
    if (statFis) statFis.textContent = (typeof fisData !== 'undefined' ? fisData : []).length;
    if (statZ)   statZ.textContent   = (typeof zData   !== 'undefined' ? zData   : []).length;

    if (typeof showNotif === 'function') showNotif('☁️ Veriler buluttan yüklendi!', 'success');
    return true;
  } catch (e) {
    console.warn('[CloudLoad]', e.message);
    return false;
  }
}

console.info('[TahAPI] Backend bridge yüklendi →', _API_BASE);
