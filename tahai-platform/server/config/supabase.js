const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.TAHAI_SUPA_URL || '').trim();
const supabaseKey = (process.env.TAHAI_SUPA_KEY || '').trim();

console.log('[Supabase] URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'TANIMSIZ');
console.log('[Supabase] KEY:', supabaseKey ? 'var' : 'TANIMSIZ');

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] HATA: TAHAI_SUPA_URL veya TAHAI_SUPA_KEY tanımsız!');
  throw new Error('TAHAI_SUPA_URL ve TAHAI_SUPA_KEY tanımlanmalı');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
