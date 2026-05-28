import { createClient } from '@supabase/supabase-js';

// Pegamos a URL e a Key das variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Inicializamos o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
