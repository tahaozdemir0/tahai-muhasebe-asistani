const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

console.log('[Supabase] URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'TANIMSIZ');
console.log('[Supabase] KEY:', supabaseKey ? 'var' : 'TANIMSIZ');

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] HATA: SUPABASE_URL veya SUPABASE_KEY tanımsız!');
  console.error('[Supabase] Mevcut env keys:', Object.keys(process.env).filter(k => k.startsWith('SUPA') || k.startsWith('JWT')));
  throw new Error('SUPABASE_URL ve SUPABASE_KEY tanımlanmalı');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
