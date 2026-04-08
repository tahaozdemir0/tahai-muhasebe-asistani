// ═══════════════════════════════════════════════════════════════
// YARDIM SİSTEMİ — TahAI Platformu
// Her modülün "?" butonu bu dosyadaki içerikleri açar.
// Aşama A+B: Tüm 21 modülün yardım içerikleri tamamlandı.
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

      <h3>📊 Fişler KDV Oranına Göre Gruplandırıldı</h3>
      <p>İşlenen fişler otomatik olarak 3 renkli gruba ayrılır:</p>
      <ul>
        <li><strong>🟢 %1 KDV'Lİ FİŞLER</strong> — Gıda, market gibi</li>
        <li><strong>🟡 %10 KDV'Lİ FİŞLER</strong> — Restoran, kafe gibi</li>
        <li><strong>🔵 %20 KDV'Lİ FİŞLER</strong> — Akaryakıt, ofis malzemeleri gibi</li>
      </ul>
      <p>Her grubun başlığında <strong>toplam matrah, KDV ve toplam tutar</strong> gösterilir.</p>

      <div class="info-kutu">
        <strong>💡 Neden Gruplandırdık?</strong><br>
        Muhasebede fişleri KDV oranına göre ayrı toplu işlemek standart uygulamadır.
        Her grup doğrudan Luca'ya toplu giriş için hazır bilgi sunar.<br><br>
        <strong>📊 Gruplu CSV İndir</strong> butonu ile her grubu ayrı bölümde,
        özet tablolarla birlikte CSV olarak indirebilirsiniz.
      </div>
    `
  },

  'faturalar': {
    baslik: '📄 Fatura Listesi Kontrolü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Mükellefin alış ve satış faturalarını yönetir. AI ile fatura
      okuma, Luca-Entegratör karşılaştırma ve KDV/Tevkifat kontrolü
      olmak üzere 3 alt özellik içerir.</p>

      <h3>🔍 Akıllı Filtre Barı</h3>
      <p>Fatura listesi yüklendikten sonra sonuçların üstünde 6 renkli
      filtre kutusu belirir. Her kutu ilgili fatura sayısını gösterir,
      tıklayınca tablo o kategoriye göre süzülür.</p>

      <div class="info-kutu">
        <strong>📋 TÜMÜ</strong> — Tüm faturalar (varsayılan)<br>
        <strong>✅ İŞLENMİŞ</strong> — Durum "Tamam", sorunsuz faturalar<br>
        <strong>⚠️ İŞLENMEMİŞ</strong> — Durum "UYARI", kontrol gereken<br>
        <strong>🔄 MÜKERRER</strong> — Aynı fatura no + VKN + tutar ile birden fazla kayıt<br>
        <strong>💼 TEVKİFATLI</strong> — Notta "tevkifat" geçen faturalar<br>
        <strong>❌ SORUNLU</strong> — Durum "HATA" veya kritik hata içerenler
      </div>

      <div class="info-kutu">
        <strong>📊 Gruplu CSV</strong> butonu ile faturalar 4 gruba ayrılmış
        şekilde (İşlenmiş / İşlenmemiş / Tevkifatlı / Sorunlu) ve
        her grup için ara toplam satırıyla CSV'ye aktarılır.
      </div>

      <div class="info-kutu">
        <strong>📑 Alt özellikler için ayrı yardımlar var:</strong><br>
        • Fatura İşleme (AI ile okuma)<br>
        • Luca-Uyumsoft Karşılaştırma<br>
        • KDV & Tevkifat Kontrolü
      </div>

      <h3>Genel akış</h3>
      <ol>
        <li>Üstten mükellefi seçin</li>
        <li>Dönemi seçin</li>
        <li>Fatura türünü seçin (Alış / Satış)</li>
        <li>Fatura verisi yüklendikten sonra filtre barından kategori seçin</li>
        <li>İhtiyacınıza göre alt özelliklerden birini kullanın</li>
      </ol>
    `
  },

  'fatura-isleme': {
    baslik: '📋 AI ile Fatura İşleme',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Fatura görselini veya PDF'ini AI ile okuyarak firma adı,
      VKN, tarih, matrah, KDV ve toplam tutarı otomatik çıkarır.
      Hesap kodunu seçip Luca'ya aktarmaya hazır CSV oluşturur.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        Bu özellik için Luca'dan indirmeye gerek yok. Fatura
        görselini doğrudan yükleyebilirsiniz.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellefi seçin</li>
        <li>Fatura türünü seçin: <strong>Alış</strong> veya <strong>Satış</strong></li>
        <li>Fatura görsellerini yükleyin (JPG, PNG, PDF)</li>
        <li><strong>"🤖 AI ile Fatura Oku"</strong> butonuna basın</li>
        <li>AI tüm bilgileri otomatik çıkarır</li>
        <li>Tabloda hesap kodunu seçin</li>
        <li>Kontrol edin, gerekirse düzeltin</li>
        <li><strong>"⬇️ Luca Excel İndir"</strong> veya
            <strong>"💾 Mükellefe Kaydet"</strong></li>
      </ol>

      <div class="info-kutu">
        <strong>💡 İpuçları</strong><br>
        • Birden fazla fatura aynı anda yüklenebilir<br>
        • PDF formatı tercih edilir, daha net okur<br>
        • VKN/TCKN otomatik tespit edilir
      </div>
    `
  },

  'luca-uyumsoft': {
    baslik: '🔄 Luca ↔ Fatura Entegratörü Karşılaştırma',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Luca'ya işlenen faturalar ile e-Fatura entegratörü
      (Uyumsoft, İşNet, NES, Logo, Mikro vs.) arasındaki tutarsızlıkları
      bulur. Eksik fatura, tutar farkı veya kayıp kayıtları yakalar.
      Mali müşavirin en çok zaman kaybettiği işlerden biri budur.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Yol:</strong> Luca → Mali Müşavir → Cari →
        <strong>Fatura Listesi</strong> → Dönem seç →
        <strong>Excel olarak dışa aktar</strong><br><br>
        <strong>Alternatif:</strong> Luca → Raporlar →
        Fatura Hareket Raporu → Excel
      </div>

      <div class="luca-kutu">
        <strong>📥 Entegratörden ne indirmeniz gerekiyor?</strong><br>
        <strong>Uyumsoft:</strong> Gelen/Giden Faturalar → Tarih aralığı → Excel<br>
        <strong>İşNet:</strong> e-Fatura → Liste → Excel<br>
        <strong>NES:</strong> Fatura Yönetimi → Rapor → Excel
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Sol kutuya <strong>Luca Excel'ini</strong> yükleyin</li>
        <li>Sağ kutuya <strong>Entegratör dosyasını</strong> yükleyin</li>
        <li><strong>"🔄 Karşılaştır"</strong> butonuna basın</li>
        <li>4 kart halinde sonuçlar: Luca Toplam, Entegratör Toplam,
            Eşleşen, Sorunlu</li>
        <li>Eşleşmeyen faturalar tabloda kırmızı/sarı işaretli görünür</li>
        <li><strong>"💾 Mükellefe Kaydet"</strong> ile arşivleyin</li>
        <li><strong>"📥 CSV İndir"</strong> ile rapor alın</li>
      </ol>

      <div class="uyari-kutu">
        <strong>⚠️ Dikkat</strong><br>
        Aynı dönem için her iki dosyayı da yüklediğinizden emin olun.
        Farklı dönemler karşılaştırılırsa hatalı sonuç verir.
      </div>
    `
  },

  'kdv-tevkifat': {
    baslik: '🔍 KDV & Tevkifat Kontrolü',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Fatura listesindeki KDV oranlarını, tevkifat hesaplamalarını
      ve beyan edilecek KDV'yi otomatik kontrol eder. Tevkifat
      unutulmuş veya yanlış uygulanmış faturaları yakalar.</p>

      <div class="luca-kutu">
        <strong>📥 Ne indirmeniz gerekiyor?</strong><br>
        Doğrudan e-Fatura entegratöründen (Uyumsoft, İşNet vs.)
        fatura listesi Excel'i alın. Luca'dan indirmeye gerek yok.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Excel dosyasını yükleyin (sütun başlıkları 1. satırda olmalı)</li>
        <li><strong>"⚡ Faturaları Kontrol Et"</strong> butonuna basın</li>
        <li>6 özet kart: Toplam Fatura, KDV, Tevkifatlı Sayı,
            Tevkifat Tutarı, Beyan KDV, Uyarı</li>
        <li>Tabloda her fatura tek tek kontrol edilir</li>
        <li>Filtreler: 🔴 Hata, 🟡 Uyarı, 🟢 Sorunsuz</li>
        <li><strong>"🤖 AI ile Detaylı Analiz"</strong> ile yorumlatın</li>
        <li><strong>"📥 Kontrol Raporunu İndir"</strong> ile rapor alın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Yaygın Tevkifat Hataları</strong><br>
        • Danışmanlık faturalarında 3/10 tevkifat unutulması<br>
        • Yapım işlerinde 4/10 tevkifat eksikliği<br>
        • Temizlik hizmetlerinde 9/10 tevkifat
      </div>
    `
  },

  'mizan': {
    baslik: '📊 Mizan Analizi Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Luca'dan alınan mizanı analiz eder, hesap kodlarını AI ile
      öğrenir, KDV mutabakatı yapar ve ters bakiyeleri tespit eder.
      Aynı zamanda muavin defter ile birlikte ters bakiye kaynak
      tespiti de yapabilir.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Yol:</strong> Luca → Mali Müşavir → Raporlar →
        <strong>Mizan Raporu</strong><br>
        Dönem aralığını seçin → <strong>"Excel'e Aktar"</strong><br><br>
        <strong>Format:</strong> Hesap Kodu, Hesap Adı, Borç Toplamı,
        Alacak Toplamı, Borç Bakiye, Alacak Bakiye sütunları olmalı
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Mizan Excel'ini yükleyin</li>
        <li><strong>"🤖 AI Analiz Et & Kodları Öğren"</strong> butonuna basın</li>
        <li>AI hesap kodlarını fiş türleriyle eşler</li>
        <li>4 kart: Hesaplanan KDV, İndirilecek KDV,
            Ödenecek/Devir KDV, Toplam Hesap Kodu</li>
        <li>Altta tüm mizan satırları, ters bakiyeler kırmızı işaretli</li>
        <li><strong>"💾 Mükellefe Kaydet"</strong> ile arşivleyin</li>
      </ol>

      <h3>🔍 Ters Bakiye Kaynak Tespiti</h3>
      <p>Bir hesap ters bakiye verdiğinde, hangi tarihte ve hangi fişten
      kaynaklandığını bulmak için muavin defter yükleyebilirsiniz.</p>

      <div class="luca-kutu">
        <strong>📥 Muavin Defter İndirme:</strong><br>
        Luca → Raporlar → <strong>Muavin Defter</strong> →
        Dönem ve hesap seç → Excel'e Aktar
      </div>
    `
  },

  'hatirlatici': {
    baslik: '🔔 Fiş Hatırlatıcı Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Hangi mükelleflerin fişi geldi, hangisi gelmedi takibi yapar.
      Her ay başında sıfırlanır, fiş gelen mükellefleri işaretlersiniz.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        Bu modül için Luca'dan indirmeye gerek yok. Sadece
        <strong>Ayarlar</strong> sayfasından mükellef listenizi
        eklemeniz yeterli.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Önce <strong>Ayarlar</strong> sayfasından mükelleflerinizi
            ekleyin (veya Luca'dan toplu aktarın)</li>
        <li>Hatırlatıcı sayfasına gidin, tüm mükellefler listede görünür</li>
        <li>Fiş gelen mükellefin yanındaki butona tıklayın</li>
        <li>Üstte 3 sayaç güncellenir: Toplam, Geldi, Bekleniyor</li>
        <li>Ay başında <strong>"🔄 Dönemi Sıfırla"</strong> ile yeniden başlayın</li>
      </ol>
    `
  },

  'kamera': {
    baslik: '📷 Kamera Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Telefondan veya bilgisayar kamerasından doğrudan fotoğraf çekip
      işler. Dosya seçmeye gerek yok — çek, seç türü, işle.</p>

      <div class="luca-kutu">
        <strong>📥 Ne lazım?</strong><br>
        Hiçbir şey, sadece kameralı bir cihaz (telefon veya laptop).
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Türü seçin: <strong>Fiş / Z Raporu / Fatura</strong></li>
        <li><strong>"📷 Kamerayı Aç"</strong> (masaüstü) veya
            <strong>"📱 Fotoğraf Çek"</strong> (mobil) butonuna basın</li>
        <li>Fotoğrafı çekin</li>
        <li><strong>"⚡ Çekilen Fotoğrafları İşle"</strong> butonuna basın</li>
        <li>AI seçilen türe göre işlem yapar</li>
        <li>Sonuçlar tabloda görünür</li>
        <li><strong>"⬇️ Luca Excel İndir"</strong> ile aktarın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Avantajı</strong><br>
        Ofise gelen fişleri anında çekebilir, dosya yüklemeden
        direkt işleyebilirsiniz. Mobilde özellikle pratik.
      </div>
    `
  },

  'hesaplamalar': {
    baslik: '🧮 Hesaplamalar Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Mali müşavirin sıkça ihtiyaç duyduğu vergi hesaplamalarını
      hızlıca yapar. 3 alt özellik içerir.</p>

      <div class="info-kutu">
        <strong>📑 Alt özellikler:</strong><br>
        • <strong>KDV Hesaplama</strong> — 3 yönlü KDV hesabı<br>
        • <strong>KKEG Hesaplayıcı</strong> — Binek araç gider hesabı<br>
        • <strong>Stopaj Hesaplama</strong> — Serbest meslek stopajı
      </div>

      <p>Her alt özelliğin kendi yardım dökümanı için sekmedeki
      <strong>?</strong> butonuna tıklayın.</p>
    `
  },

  'kdv-hesaplama': {
    baslik: '🧮 KDV Hesaplama',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>KDV'li tutar hesaplama. 3 yönlü çalışır: Matrah, KDV veya
      Toplam'dan hangisini girerseniz diğer ikisini otomatik hesaplar.</p>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>KDV oranını seçin: <strong>%1, %10 veya %20</strong></li>
        <li>Üç alandan birine değer girin:
          <ul>
            <li><strong>Matrah</strong> (KDV hariç) → KDV ve Toplam çıkar</li>
            <li><strong>KDV Tutarı</strong> → Matrah ve Toplam çıkar</li>
            <li><strong>Toplam</strong> (KDV dahil) → Matrah ve KDV çıkar</li>
          </ul>
        </li>
        <li>Sonuçlar anlık olarak alt kartlarda görünür</li>
        <li><strong>"🔄 Temizle"</strong> ile yeniden başlayın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Örnek</strong><br>
        Toplam: 1.200 ₺ (KDV dahil) %20 KDV<br>
        → Matrah: 1.000 ₺<br>
        → KDV: 200 ₺
      </div>
    `
  },

  'kkeg': {
    baslik: '🚗 Binek Araç KKEG Hesaplayıcı',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Binek araç giderlerinin %30'u Kanunen Kabul Edilmeyen Gider
      (KKEG) sayılır ve kurumlar vergisi matrahına eklenir. Bu modül
      araç giderlerini doğru şekilde KKEG ve gider olarak ayırır.</p>

      <div class="uyari-kutu">
        <strong>⚠️ Yasal Çerçeve</strong><br>
        7194 Sayılı Kanun ile binek araç giderlerinin %70'i gider,
        %30'u KKEG olarak kayıt edilir. Bu hesaplama tüm gider türleri
        (yakıt, bakım, onarım, sigorta) için geçerlidir.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Açıklama girin (örn: "Yakıt - Şubat 2026")</li>
        <li>Gider türünü seçin</li>
        <li>KDV dahil tutarı girin</li>
        <li>KDV oranını seçin</li>
        <li>Birden fazla satır için <strong>"+ Satır Ekle"</strong></li>
        <li><strong>"🧮 Hesapla"</strong> butonuna basın</li>
        <li>Sistem otomatik hesaplar:
          <ul>
            <li>KDV Hariç Toplam</li>
            <li>Gider Yazılan (%70)</li>
            <li>Matrah KKEG (%30)</li>
            <li>KDV KKEG</li>
          </ul>
        </li>
        <li><strong>"⬇️ Excel İndir (Luca Formatı)"</strong> ile aktarın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Hesap Kodları</strong><br>
        • 689.01 → KKEG Matrah<br>
        • 689.02 → KKEG KDV
      </div>
    `
  },

  'stopaj': {
    baslik: '📋 Stopaj Hesaplama',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Avukat, danışman, muhasebeci gibi serbest meslek erbabına
      yapılan ödemelerde stopaj hesabı yapar. Net ödeme, stopaj
      tutarı ve muhtasar matrahı otomatik çıkarır.</p>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Açıklama / kişi adını girin</li>
        <li>Brüt tutarı girin</li>
        <li>KDV oranını seçin (genelde %20)</li>
        <li>Stopaj oranını girin (genelde %20)</li>
        <li>Birden fazla satır için <strong>"+ Satır Ekle"</strong></li>
        <li><strong>"🧮 Hesapla"</strong> butonuna basın</li>
        <li>Sistem hesaplar:
          <ul>
            <li>KDV Tutarı</li>
            <li>Stopaj Tutarı</li>
            <li>Net Ödeme</li>
            <li>Muhtasar Matrah</li>
          </ul>
        </li>
        <li><strong>"⬇️ Excel İndir"</strong></li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Yaygın Stopaj Oranları</strong><br>
        • Serbest meslek (avukat, mali müşavir): %20<br>
        • Kira ödemesi: %20<br>
        • Yurt dışı hizmet alımı: %20
      </div>
    `
  },

  'mukellef-karti': {
    baslik: '👤 Mükellef Kartı Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Her mükellefin detaylı bilgilerini (VKN, vergi dairesi, adres,
      KDV beyan periyodu) kaydeder. Aynı zamanda o mükellefin kayıtlı
      fişlerini ve aylık özetini gösterir.</p>

      <h3>Yöntem 1: Manuel Mükellef Ekleme</h3>
      <ol>
        <li><strong>"+ Yeni Mükellef Kartı"</strong> butonuna basın</li>
        <li>Bilgileri doldurun:
          <ul>
            <li>Mükellef adı / unvanı</li>
            <li>Vergi Kimlik Numarası (VKN)</li>
            <li>Vergi Dairesi</li>
            <li>Mükellefiyet Türü</li>
            <li>Adres, Telefon, E-posta</li>
          </ul>
        </li>
        <li>KDV Beyan Periyodunu seçin: <strong>Aylık veya 3 Aylık</strong></li>
        <li><strong>"💾 Kaydet"</strong></li>
      </ol>

      <h3>Yöntem 2: Luca'dan Toplu Aktarım (Önerilen)</h3>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Yol:</strong> Luca → Mali Müşavir →
        <strong>Müşteri Listesi</strong> →
        "Filtre Raporu" → <strong>Excel olarak dışa aktar</strong><br><br>
        <strong>Format:</strong> Kısa Ad, Uzun Ad, Vergi Dairesi,
        Vergi No, TC, Açıklama, Kuruluş Tarihi sütunları olmalı
      </div>

      <ol>
        <li><strong>"📥 Luca'dan Toplu Aktar"</strong> butonuna basın</li>
        <li>Excel'i yükleyin</li>
        <li>Tüm mükellefler listede görünür</li>
        <li><strong>"Tümünü Seç"</strong> veya tek tek işaretleyin</li>
        <li><strong>"💾 Seçilenleri Kaydet"</strong></li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Bonus: Aylık Özet</strong><br>
        Mükellef kartını açtığınızda bu ayki KDV, işlem sayısı ve
        kayıtlı fişler otomatik gösterilir.
      </div>
    `
  },

  'beyanname-takvimi': {
    baslik: '📅 Beyanname Takvimi',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Bu ay ve yaklaşan beyanname ile ödeme tarihlerini gösterir.
      KDV, Muhtasar, SGK, Geçici Vergi ve diğer vergi tarihlerini
      renk koduyla işaretler.</p>

      <div class="luca-kutu">
        <strong>📥 Ne lazım?</strong><br>
        Hiçbir şey, sistem otomatik gösterir.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Ayı seçin</li>
        <li><strong>"🔄 Güncelle"</strong> butonuna basın</li>
        <li>Bu hafta verilecek beyannameler 🔴 kırmızı,
            bu ay verilecekler 🟡 sarı görünür</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Renk Kodları</strong><br>
        • 🔴 <strong>Kırmızı:</strong> Bu hafta son tarih (acil)<br>
        • 🟡 <strong>Sarı:</strong> Bu ay verilecek<br>
        • ⚪ <strong>Gri:</strong> Gelecek ay
      </div>
    `
  },

  'beyanname-kontrol': {
    baslik: '📋 Beyanname Öncesi Kontrol',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Beyanname göndermeden önce mizan verilerinden KDV-1, Muhtasar,
      SGK ve Geçici Vergi rakamlarını otomatik kontrol eder. Trafik
      lambası sistemiyle "gönderilebilir" veya "risk var" der.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Yol:</strong> Luca → Mali Müşavir → Raporlar →
        <strong>Mizan Raporu</strong><br>
        Dönem aralığını seçin → <strong>"Excel'e Aktar"</strong>
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Mizan Excel'ini yükleyin</li>
        <li><strong>"🔍 Kontrol Et"</strong> butonuna basın</li>
        <li>4 kart: KDV-1, Muhtasar, SGK, Geçici Vergi</li>
        <li>Renkleri kontrol edin:
          <ul>
            <li>✅ <strong>UYGUN</strong> — Beyanname gönderilebilir</li>
            <li>🟡 <strong>UYARI</strong> — Küçük fark var, kontrol edin</li>
            <li>❌ <strong>SORUN</strong> — Kritik fark, düzeltme gerekli</li>
          </ul>
        </li>
        <li>Her karta tıklayınca detay açılır</li>
        <li><strong>"🤖 AI ile Analiz Et"</strong> butonu ile Claude yorum yapar</li>
        <li><strong>"🖨️ Tüm Kontrolleri Yazdır / PDF"</strong> ile rapor alın</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 İlk Kullanımda</strong><br>
        Sistem mükellefin hesap planını AI ile tanır ve onaylatır.
        Onay sonrası eşleme kaydedilir, sonraki yüklemelerde
        tekrar sorulmaz.
      </div>
    `
  },

  'kdv-mutabakat': {
    baslik: '🔍 KDV Mutabakat Kontrol',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Mizandaki 191 İndirilecek KDV, 391 Hesaplanan KDV ve 360
      Ödenecek KDV hesaplarının doğru hesaplanıp hesaplanmadığını
      detaylı kontrol eder. KDV-1 ve KDV-2 ayrı ayrı işlenir.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Yol:</strong> Luca → Mali Müşavir → Raporlar →
        <strong>Mizan Raporu</strong> → Excel'e Aktar
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Mizan Excel'ini yükleyin</li>
        <li><strong>"🔍 KDV Kontrol Et"</strong> butonuna basın</li>
        <li>4 kart: 391 Hesaplanan, 191 İndirilecek,
            Ödenecek/Devir, Kontrol Durumu</li>
        <li>Detay tablosu:
          <ul>
            <li>391 Toplam Hesaplanan KDV</li>
            <li>191 Toplam İndirilecek KDV</li>
            <li>KDV-2 Kontrolü (360.03 = 191.03)</li>
            <li>Oran bazlı detay (%1, %10, %20)</li>
          </ul>
        </li>
        <li><strong>"⬇️ Excel İndir"</strong> veya
            <strong>"🖨️ Yazdır / PDF"</strong></li>
      </ol>

      <div class="uyari-kutu">
        <strong>⚠️ İlk Kullanımda Hesap Planı Eşleştirme</strong><br>
        Her mükellefin alt hesap kodları farklı olabilir. İlk kullanımda
        sistem hesapları AI ile tanır ve onaylatır. Onay sonrası
        eşleme kaydedilir.
      </div>
    `
  },

  'donem-kapanis': {
    baslik: '✅ Dönem Kapanış Kontrol Listesi',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Ay sonu kapanış için 10 maddelik kontrol listesi. Mali
      müşavirin yapması gereken tüm kontroller checklist halinde
      sunulur. Mizan yüklenmişse hesap bakiyeleri otomatik dolar.</p>

      <div class="luca-kutu">
        <strong>📥 Luca'dan ne indirmeniz gerekiyor?</strong><br>
        <strong>Mizan</strong> (opsiyonel ama önerilen):
        Luca → Raporlar → Mizan Raporu → Excel
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Mükellef ve dönem seçin</li>
        <li>Mizan yükleyin (opsiyonel)</li>
        <li><strong>"📋 Listeyi Yükle"</strong> butonuna basın</li>
        <li>10 madde görünür:
          <ul>
            <li>Kasa hesabı (100) kontrol</li>
            <li>Banka hesabı (102) kontrol</li>
            <li>Amortisman kayıtları</li>
            <li>Gelecek aylara ait giderler virmanı</li>
            <li>Personel fişi kesildi mi</li>
            <li>SGK bildirgeleri</li>
            <li>KDV mutabakatı</li>
            <li>Beyanname kontrolü</li>
            <li>Ters bakiye kontrolü</li>
          </ul>
        </li>
        <li>Her maddeyi kontrol edip işaretleyin</li>
        <li>İlerleme çubuğu güncellenir</li>
        <li>Ay sonunda <strong>"🔄 Dönemi Sıfırla"</strong></li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Otomatik Doldurma</strong><br>
        Mizan yüklediğinizde hesap bakiyeleri ilgili maddelerin
        yanında otomatik görünür. Kasa negatif mi, banka uyumlu
        mu — tek bakışta görürsünüz.
      </div>
    `
  },

  'risk-raporu': {
    baslik: '⚠️ Risk Raporu Dashboard',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Tüm mükelleflerin risk durumunu tek ekranda gösterir. Hangi
      mükellef acil takip gerektirir — bir bakışta görürsünüz.
      Mali müşavirin her sabah ilk bakacağı sayfa.</p>

      <div class="luca-kutu">
        <strong>📥 Ne lazım?</strong><br>
        Önceden mizan yüklenmiş mükellefler. Mizan yüklenmemişse
        risk skoru hesaplanamaz.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>4 özet kart: Toplam, 🔴 Yüksek, 🟡 Orta, 🟢 Düşük</li>
        <li>Dönem seçin</li>
        <li>Risk seviyesi filtresi: Tümü / Yüksek / Orta / Düşük</li>
        <li>Mükellef arama kutusu kullanabilirsiniz</li>
        <li><strong>"↺ Verileri Yenile"</strong> butonuna basın</li>
        <li>Mükellefler risk skoruna göre sıralı tabloda görünür</li>
        <li>Bir mükellefe tıklayın → Detay sayfası açılır</li>
        <li><strong>"🤖 Analiz Et"</strong> ile Claude detaylı analiz yapar</li>
        <li><strong>"⬇️ Excel"</strong> ile rapor indirebilirsiniz</li>
      </ol>

      <h3>Risk Skoru Nasıl Hesaplanır?</h3>
      <ul>
        <li><strong>KDV Mutabakat hatası:</strong> +30 puan</li>
        <li><strong>Beyanname hatası:</strong> +30 puan</li>
        <li><strong>Dönem kapanış eksik:</strong> +10 puan</li>
        <li><strong>Ters bakiye:</strong> +10 puan</li>
      </ul>

      <div class="info-kutu">
        <strong>💡 Risk Seviyeleri</strong><br>
        • 0-25 puan → 🟢 Düşük Risk<br>
        • 26-60 puan → 🟡 Orta Risk<br>
        • 61+ puan → 🔴 Yüksek Risk
      </div>
    `
  },

  'sonuclar': {
    baslik: '📊 Sonuçlar Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Tüm modüllerin verilerini tek Excel dosyasında birleştirir.
      Z raporları, fişler ve fatura kontrolü ayrı sayfalarda
      indirilir.</p>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>4 sayaç: İşlenen Z Raporu, İşlenen Fiş,
            Kontrol Edilen Fatura, Toplam Excel Çıktı</li>
        <li><strong>"⬇️ Tümünü İndir (Çok Sayfalı Excel)"</strong>
            butonuna basın</li>
        <li>Tüm veriler tek Excel'de birleştirilir</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Bulut Senkronizasyonu</strong><br>
        Veriler her işlemde otomatik buluta kaydedilir. Farklı
        bilgisayarda açtığınızda otomatik yüklenir.
        <strong>"☁️ Şimdi Kaydet"</strong> ve
        <strong>"🔄 Buluttan Yükle"</strong> manuel kontrol için.
      </div>

      <h3>💾 Yedekleme</h3>
      <p>Tüm mükellef kartları, hatırlatıcı verileri ve ayarları
      tek dosyaya aktarabilirsiniz. Yeni bilgisayarda geri yükleyebilirsiniz.</p>
      <ol>
        <li><strong>"⬇️ Yedeği İndir"</strong> ile dosyayı kaydedin</li>
        <li>Yeni cihazda <strong>"⬆️ Yedeği Yükle"</strong> ile geri getirin</li>
      </ol>
    `
  },

  'kdv-2': {
    baslik: '🌍 KDV-2 Hesaplama (Sorumlu Sıfatıyla)',
    icerik: `
      <h3>Bu özellik ne işe yarar?</h3>
      <p>Yurt dışından alınan hizmetler ve tevkifata tabi
      işlemlerde sorumlu sıfatıyla beyan edilecek KDV-2
      tutarını hesaplar.</p>

      <div class="info-kutu">
        <strong>💡 KDV-2 Nedir?</strong><br>
        Yurt dışı satıcılardan veya tevkifata tabi hizmetlerde
        alıcı (Türk firması) KDV'yi sorumlu sıfatıyla beyan eder.
        Bu KDV-2 beyannamesinde <strong>360.03</strong> hesabında
        alacak, <strong>191.03</strong> hesabında borç olarak
        raporlanır.
      </div>

      <h3>Adım adım kullanım</h3>
      <ol>
        <li>Açıklama girin (örn: "Google Cloud EMEA")</li>
        <li>Hizmet türünü seçin — tevkifat oranı otomatik dolar</li>
        <li>Brüt tutarı (KDV hariç) girin</li>
        <li>KDV oranını seçin (%1, %10, %20)</li>
        <li>Gerekirse tevkifat oranını düzenleyin</li>
        <li>Birden fazla işlem için <strong>"+ Satır Ekle"</strong></li>
        <li><strong>"🧮 Hesapla"</strong> butonuna basın</li>
        <li>Sonuç kartlarında tevkif edilen KDV görünür</li>
        <li><strong>"⬇️ Excel İndir"</strong> ile Luca'ya aktarın</li>
      </ol>

      <div class="info-kutu">
        <strong>📋 Yaygın Tevkifat Oranları</strong><br>
        • Yurt dışı hizmet → 10/10 (Tam tevkifat)<br>
        • Danışmanlık → 3/10<br>
        • Yapım işi → 4/10<br>
        • Temizlik / Özel güvenlik → 9/10<br>
        • Yemek servisi → 5/10
      </div>

      <div class="uyari-kutu">
        <strong>⚠️ Muhasebe Kaydı</strong><br>
        Tevkif edilen KDV alıcının <strong>360.03</strong> hesabına
        alacak, <strong>191.03</strong> hesabına borç olarak kaydedilir.
        Bu iki tutar eşit olmalıdır. KDV Mutabakat modülünde
        bu kontrol otomatik yapılır.
      </div>
    `
  },

  'ayarlar': {
    baslik: '⚙️ Ayarlar Modülü',
    icerik: `
      <h3>Bu modül ne işe yarar?</h3>
      <p>Mükellef listesi yönetimi, fiş türü-muhasebe kodu
      eşleştirmeleri ve sistem ayarlarını içerir.</p>

      <h3>1. Mükellef Listesi</h3>
      <p>Sık kullandığınız mükellefleri ekleyin. Fiş ve Z raporu
      işlerken açılır listeden hızlıca seçebilirsiniz.</p>
      <ol>
        <li><strong>"+ Ekle"</strong> butonuna basın</li>
        <li>Mükellef adını yazın</li>
        <li>Kaydedin</li>
      </ol>

      <div class="info-kutu">
        <strong>💡 Toplu Mükellef Aktarımı</strong><br>
        Tek tek eklemek yerine, <strong>Mükellef Kartı</strong>
        modülünden Luca müşteri listesini toplu aktarabilirsiniz.
      </div>

      <h3>2. Fiş Türü - Muhasebe Kodu Eşleştirme</h3>
      <p>Varsayılan muhasebe kodlarını düzenleyebilirsiniz. AI fiş
      okurken bu kodları kullanır.</p>

      <div class="info-kutu">
        <strong>💡 Örnek Eşlemeler</strong><br>
        • Market fişi → 770.03.020 Mutfak Gideri %1<br>
        • Akaryakıt fişi → 770.03.008 Araç Giderleri %20<br>
        • Restoran fişi → 770.03.020 Mutfak Gideri %10<br>
        • Kırtasiye → 770.03.012 Ofis Giderleri %20
      </div>

      <h3>3. Sistem Ayarları</h3>
      <p>API key, tema, dil gibi sistem ayarlarını düzenleyebilirsiniz.</p>
    `
  },
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
