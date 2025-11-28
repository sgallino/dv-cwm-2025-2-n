// Este servicio va a ofrecer el cliente de Supabase.
// En este contexto, un servicio es una biblioteca o clase que ofrece alguna funcionalidad a través de
// sus funciones o métodos.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);