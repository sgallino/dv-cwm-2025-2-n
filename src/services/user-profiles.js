import { supabase } from "./supabase";

/**
 * 
 * @param {String} id 
 * @returns {Promise<{id: String, email: String, display_name: String|null, bio: String|null, career: String|null, created_at: String}>}
 */
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        // Pedimos que la columna "id" tenga el valor id recibido. Esto agrega un WHERE en el query.
        .eq('id', id)
        // Limitamos cuántos registros queremos traer. Podemos aclarar un 1 ya que es una búsqueda por PK.
        .limit(1)
        // single() hace que el query nos retorne un objeto con los datos de la fila, en vez de un array de objetos.
        .single();

    if(error) {
        console.error('[user-profiles.js getUserProfileById] Error al traer el perfil del usuario', id, error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario', id, error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {String} id 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data 
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);
        
    if(error) {
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario', id, error);
        throw new Error(error.message);
    }
}