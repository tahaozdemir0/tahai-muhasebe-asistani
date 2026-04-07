// ═══════════════════════════════════════════════════════════════
// YARDIM SİSTEMİ — TahAI Platformu
// Her modülün "?" butonu bu dosyadaki içerikleri açar.
// Aşama A: Altyapı + z-raporu & fis-isleme örnek içerikleri
// Aşama B'de geri kalan modüller doldurulacak.
// ═══════════════════════════════════════════════════════════════

// Tüm modüllerin yardım içerikleri
const YARDIM_ICERIK = {

  'z-raporu': {
    baslik: '🧾 Z Raporu Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Günlük yazar kasa Z raporlarını fotoğraftan AI ile okuyarak
      Luca'ya aktarmaya hazır Excel üretir.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        Bu modül için Luca'dan dosya indirmeye gerek yok.
        Sadece mükellefin getirdiği fiziksel Z raporlarının
        fotoğrafları yeterli.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Üstten mükellefi seçin</li>
        <li>Dönem seçin (örn: Şubat 2026)</li>
        <li>Z raporu fotoğraflarını sürükle-bırak veya
            tıklayarak yükleyin</li>
        <li><strong>"⚡ Z Raporlarını İşle"</strong> butonuna basın</li>
        <li>AI tarih, Z numarası, KDV oranlarına göre matrah ve
            KDV tutarlarını otomatik çıkarır</li>
        <li>Tabloyu kontrol edin</li>
        <li><strong>"⬇️ Muhasebe Kodlu İndir"</strong> veya
            <strong>"⬇️ Luca Import İndir"</strong> butonuyla Excel alın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 İpuçları</strong><br>
        • Yan yana 2 Z raporu olan tek fotoğraf çekebilirsiniz<br>
        • Bulanık fotoğraflarda hata olabilir, net çekin<br>
        • %1, %10, %20 KDV oranları ayrı ayrı gösterilir
      </div>
    `
  },

  'fis-isleme': {
    baslik: '🗂️ Fiş İşleme Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Gider fişlerinin (market, akaryakıt, restoran, kırtasiye)
      fotoğrafını AI ile okuyarak hesap koduyla birlikte
      Luca'ya aktarır.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        Bu modül için Luca'dan dosya indirmeye gerek yok.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Fiş fotoğraflarını yükleyin (birden fazla olabilir)</li>
        <li><strong>"⚡ Fişleri İşle"</strong> butonuna basın</li>
        <li>AI fiş türünü, satıcı adını, tarihi, matrahı ve
            KDV'sini çıkarır</li>
        <li>Hesap kodunu otomatik atar</li>
        <li>Yanlış varsa düzeltin</li>
        <li><strong>"⬇️ Luca Excel İndir"</strong> butonuna basın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 İpuçları</strong><br>
        • Tek seferde birden fazla fiş yükleyebilirsiniz<br>
        • AI hatalı okursa manuel düzeltme yapabilirsiniz
      </div>
    `
  },

  // Aşama B'de doldurulacak modüller
  'faturalar':           { baslik: '📄 Fatura Listesi Kontrolü',        icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'luca-uyumsoft':       { baslik: '🔄 Luca-Uyumsoft Karşılaştırma',    icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'kdv-tevkifat':        { baslik: '🧮 KDV & Tevkifat Kontrol',          icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'mizan':               { baslik: '📊 Mizan Analizi',                   icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'hatirlatici':         { baslik: '🔔 Fiş Hatırlatıcı',                 icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'kamera':              { baslik: '📷 Kamera ile Direkt Çekim',          icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'hesaplamalar':        { baslik: '🔢 Hesaplamalar',                     icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'mukellef-karti':      { baslik: '👤 Mükellef Kartı',                   icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'beyanname-takvimi':   { baslik: '📅 Beyanname & Ödeme Takvimi',        icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'beyanname-kontrol':   { baslik: '📋 Beyanname Öncesi Kontrol',         icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'kdv-mutabakat':       { baslik: '🔍 KDV Mutabakat Kontrol',            icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'donem-kapanis':       { baslik: '✅ Dönem Kapanış Kontrol Listesi',    icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'risk-raporu':         { baslik: '⚠️ Risk Raporu',                      icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'sonuclar':            { baslik: '📈 Sonuçlar',                         icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
  'ayarlar':             { baslik: '⚙️ Ayarlar',                          icerik: '<p>Bu modülün yardım içeriği yakında eklenecek.</p>' },
};

// ─── Yardım panelini aç ─────────────────────────────────────────
function yardimAc(modulId) {
  const data = YARDIM_ICERIK[modulId];

  if (!data) {
    document.getElementById('yardimBaslik').textContent = '📖 Yardım';
    document.getElementById('yardimIcerik').innerHTML =
      '<p>Bu modül için yardım içeriği henüz hazırlanmadı.</p>';
  } else {
    document.getElementById('yardimBaslik').textContent = data.baslik;
    document.getElementById('yardimIcerik').innerHTML = data.icerik;
  }

  document.getElementById('yardimOverlay').style.display = 'block';
  document.getElementById('yardimPanel').style.display = 'block';

  // Animasyon için küçük gecikme
  setTimeout(() => {
    document.getElementById('yardimPanel').classList.add('acik');
  }, 10);

  // ESC tuşu ile kapatma
  document.addEventListener('keydown', _yardimEscDinle);
}

// ─── Yardım panelini kapat ───────────────────────────────────────
function yardimKapat() {
  document.getElementById('yardimPanel').classList.remove('acik');

  setTimeout(() => {
    document.getElementById('yardimOverlay').style.display = 'none';
    document.getElementById('yardimPanel').style.display = 'none';
  }, 300);

  document.removeEventListener('keydown', _yardimEscDinle);
}

// ─── ESC dinleyici ───────────────────────────────────────────────
function _yardimEscDinle(e) {
  if (e.key === 'Escape') yardimKapat();
}
