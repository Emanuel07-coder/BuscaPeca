import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Log para sabermos se as variáveis chegaram no navegador
console.log("Vercel Env Check:", { 
    url: supabaseUrl ? "✅" : "❌", 
    key: supabaseKey ? "✅" : "❌" 
});

if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO: Variáveis do Supabase não foram encontradas! Verifique o painel da Vercel.");
}

export const supabase = createClient(
    supabaseUrl as string, 
    supabaseKey as string
);
