// ═══════════════════════════════════════════════════════════════
// AI CHATBOT SİSTEMİ — TahAI Platformu
// callClaude() fonksiyonunu kullanır, yeni API çağrısı yok.
// Aşama 1: Temel sohbet yapısı
// ═══════════════════════════════════════════════════════════════

// Mesaj geçmişi (context için, oturum boyunca tutulur)
let chatbotMesajGecmisi = [];

// ─── Chatbot'u aç ────────────────────────────────────────────────
function chatbotAc() {
  document.getElementById('chatbotPencere').style.display = 'flex';
  document.getElementById('chatbotBalon').style.display = 'none';
  setTimeout(() => {
    document.getElementById('chatbotInput').focus();
  }, 100);
}

// ─── Chatbot'u kapat ─────────────────────────────────────────────
function chatbotKapat() {
  document.getElementById('chatbotPencere').style.display = 'none';
  document.getElementById('chatbotBalon').style.display = 'flex';
}

// ─── Hızlı soru butonu ───────────────────────────────────────────
function chatbotHizliSor(soru) {
  document.getElementById('chatbotInput').value = soru;
  // Hızlı soru listesini gizle (ilk soru sorulduktan sonra)
  chatbotGonder();
}

// ─── Mesaj gönderme ana fonksiyonu ──────────────────────────────
async function chatbotGonder() {
  const input    = document.getElementById('chatbotInput');
  const btn      = document.getElementById('chatbotGonderBtn');
  const mesajlar = document.getElementById('chatbotMesajlar');

  const soru = input.value.trim();
  if (!soru) return;

  // Hızlı soru listesini ilk mesajda gizle
  const hizliDiv = document.getElementById('chatbotHizliSorular');
  if (hizliDiv) hizliDiv.style.display = 'none';

  // Kullanıcı mesajını ekrana yaz
  _chatbotMesajEkle(mesajlar, 'kullanici', soru);
  input.value = '';
  input.disabled = true;
  btn.disabled = true;
  btn.textContent = '⏳';

  // Yükleniyor göstergesi
  const yuklemeMesaj = document.createElement('div');
  yuklemeMesaj.className = 'chatbot-mesaj-yukleme';
  yuklemeMesaj.textContent = 'TahAI düşünüyor...';
  yuklemeMesaj.id = '_chatbotYukleme';
  mesajlar.appendChild(yuklemeMesaj);
  mesajlar.scrollTop = mesajlar.scrollHeight;

  // Bağlam bilgisi topla
  const context = _chatbotContextTopla();

  // Son 6 mesajı geçmiş olarak ekle (context penceresi için)
  const gecmisMetin = chatbotMesajGecmisi.slice(-6)
    .map(m => (m.rol === 'kullanici' ? 'Kullanıcı: ' : 'Asistan: ') + m.mesaj)
    .join('\n');

  const tamPrompt = `Sen TahAI muhasebe sisteminin AI asistanısın. Türk muhasebe ve vergi mevzuatı konusunda uzmansın. Kullanıcılara şu konularda yardım ediyorsun:

1) MUHASEBE SORULARI: KDV, stopaj, tevkifat, beyannameler, hesap kodları, vergi mevzuatı
2) SİSTEM KULLANIMI: TahAI'nin modülleri (Z Raporu, Fiş İşleme, Mizan, KDV Mutabakat, Beyanname Kontrol, Risk Raporu vs.) nasıl kullanılır
3) VERİ ANALİZİ: Kullanıcının yüklediği mizan/fatura verilerini yorumlama

KURALLAR:
- Kısa, net ve uygulanabilir cevaplar ver
- Muhasebe terminolojisini doğru kullan ama anlaşılır ol
- Türkçe cevap ver
- Emin değilsen "kesin için mali müşavirinize danışın" de
- Markdown kullanma, düz metin yaz
- Maksimum 200 kelime cevap ver

KULLANICI BAĞLAMI:
${context}
${gecmisMetin ? '\nÖNCEKİ MESAJLAR:\n' + gecmisMetin : ''}

KULLANICI SORUSU: ${soru}`;

  try {
    // Mevcut callClaude fonksiyonunu kullan — yeni API çağrısı yok
    const cevap = await callClaude(tamPrompt, null, true);

    // Yükleniyor mesajını kaldır
    const yuklemeEl = document.getElementById('_chatbotYukleme');
    if (yuklemeEl) yuklemeEl.remove();

    // Bot cevabını ekrana yaz
    const temizCevap = (typeof cevap === 'string') ? cevap : (cevap?.text || JSON.stringify(cevap));
    _chatbotMesajEkle(mesajlar, 'bot', temizCevap);

    // Geçmişe kaydet
    chatbotMesajGecmisi.push({ rol: 'kullanici', mesaj: soru });
    chatbotMesajGecmisi.push({ rol: 'bot', mesaj: temizCevap });

  } catch (hata) {
    const yuklemeEl = document.getElementById('_chatbotYukleme');
    if (yuklemeEl) yuklemeEl.remove();

    _chatbotMesajEkle(mesajlar, 'bot',
      '❌ Bir hata oluştu: ' + (hata.message || 'Bilinmeyen hata') +
      '\n\nLütfen tekrar deneyin.');
  } finally {
    input.disabled = false;
    btn.disabled = false;
    btn.textContent = '➤';
    input.focus();
    mesajlar.scrollTop = mesajlar.scrollHeight;
  }
}

// ─── Mesaj DOM öğesi ekle (dahili yardımcı) ─────────────────────
function _chatbotMesajEkle(container, tip, metin) {
  const el = document.createElement('div');
  el.className = tip === 'kullanici' ? 'chatbot-mesaj-kullanici' : 'chatbot-mesaj-bot';
  el.textContent = metin;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

// ─── Sayfa bağlamı topla ─────────────────────────────────────────
function _chatbotContextTopla() {
  let context = '';

  // Aktif mükellef (global değişken veya header seçici)
  try {
    const mukSec = document.getElementById('globalMukellef') ||
                   document.getElementById('kdvMutMukellef') ||
                   document.querySelector('select[id*="mukellef"]');
    if (mukSec && mukSec.value) context += `Aktif mükellef: ${mukSec.value}\n`;
  } catch (_) { /* sessizce geç */ }

  // Aktif modül
  try {
    const aktifSayfa = document.querySelector('.page.active');
    if (aktifSayfa) {
      const id = aktifSayfa.id.replace('page-', '');
      context += `Aktif modül: ${id}\n`;
    }
  } catch (_) { /* sessizce geç */ }

  // Bugünün tarihi
  context += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;

  return context || 'Genel kullanım';
}
