// Este servicio va a ofrecer el cliente de Supabase.
// En este contexto, un servicio es una biblioteca o clase que ofrece alguna funcionalidad a través de
// sus funciones o métodos.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tjadvucxvllyavcdhjjr.supabase.co";
const SUPABASE_KEY = "sb_publishable_Kkx9KvQLBY6OjrZYdSuumQ_d4__BP_H";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);