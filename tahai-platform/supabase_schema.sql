-- TahAI Platform — Supabase Şema
-- Supabase SQL Editor'a kopyalayıp çalıştır

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  ad TEXT DEFAULT '',
  rol TEXT DEFAULT 'muhasebeci', -- muhasebeci, admin, super_admin
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mükellefler
CREATE TABLE IF NOT EXISTS mukellefler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ad TEXT NOT NULL,
  vkn TEXT DEFAULT '',
  vergi_dairesi TEXT DEFAULT '',
  tur TEXT DEFAULT '',
  adres TEXT DEFAULT '',
  tel TEXT DEFAULT '',
  email TEXT DEFAULT '',
  "not" TEXT DEFAULT '',
  kdv_periyot TEXT DEFAULT 'aylik',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Z Raporları
CREATE TABLE IF NOT EXISTS z_raporlari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mukellef_id UUID REFERENCES mukellefler(id) ON DELETE CASCADE,
  tarih TEXT DEFAULT '',
  z_sayac TEXT DEFAULT '',
  toplam NUMERIC DEFAULT 0,
  topkdv NUMERIC DEFAULT 0,
  kdv_10_matrah NUMERIC DEFAULT 0,
  kdv_10_tutar NUMERIC DEFAULT 0,
  kdv_20_matrah NUMERIC DEFAULT 0,
  kdv_20_tutar NUMERIC DEFAULT 0,
  kdv_1_matrah NUMERIC DEFAULT 0,
  kdv_1_tutar NUMERIC DEFAULT 0,
  donem TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fişler
CREATE TABLE IF NOT EXISTS fisler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mukellef_id UUID REFERENCES mukellefler(id) ON DELETE CASCADE,
  tarih TEXT DEFAULT '',
  fis_turu TEXT DEFAULT '',
  satici TEXT DEFAULT '',
  kdv_orani NUMERIC DEFAULT 0,
  matrah NUMERIC DEFAULT 0,
  kdv_tutari NUMERIC DEFAULT 0,
  toplam NUMERIC DEFAULT 0,
  donem TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Faturalar
CREATE TABLE IF NOT EXISTS faturalar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mukellef_id UUID REFERENCES mukellefler(id) ON DELETE CASCADE,
  tarih TEXT DEFAULT '',
  tur TEXT NOT NULL, -- 'alis' | 'satis'
  belge_no TEXT DEFAULT '',
  satici_alici TEXT DEFAULT '',
  kdv_orani NUMERIC DEFAULT 0,
  matrah NUMERIC DEFAULT 0,
  kdv_tutari NUMERIC DEFAULT 0,
  toplam NUMERIC DEFAULT 0,
  donem TEXT DEFAULT '',
  kaynak TEXT DEFAULT 'manuel', -- 'excel' | 'gorsel' | 'xml' | 'manuel'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mizanlar
CREATE TABLE IF NOT EXISTS mizanlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mukellef_id UUID REFERENCES mukellefler(id) ON DELETE CASCADE,
  donem TEXT DEFAULT '',
  tarih_araligi TEXT DEFAULT '',
  firma_adi TEXT DEFAULT '',
  satirlar JSONB DEFAULT '[]',
  anomali_raporu TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hesap Kodları (mükellef bazlı öğrenme)
CREATE TABLE IF NOT EXISTS hesap_kodlari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mukellef_id UUID REFERENCES mukellefler(id) ON DELETE CASCADE,
  hesap_kodu TEXT NOT NULL,
  hesap_adi TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, mukellef_id, hesap_kodu)
);

-- Abonelikler
CREATE TABLE IF NOT EXISTS abonelikler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free', -- free, basic, pro
  baslangic TIMESTAMPTZ,
  bitis TIMESTAMPTZ,
  aktif BOOLEAN DEFAULT true
);

-- Row Level Security (RLS) — Her kullanıcı kendi verisini görür
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mukellefler ENABLE ROW LEVEL SECURITY;
ALTER TABLE z_raporlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE fisler ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE mizanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE hesap_kodlari ENABLE ROW LEVEL SECURITY;

-- Not: Backend JWT ile erişim yönettiği için Supabase service_role key kullanılıyor.
-- RLS politikaları service_role tarafından bypass edilir.
-- İleride Supabase Auth'a geçildiğinde politikalar aktive edilecek.
