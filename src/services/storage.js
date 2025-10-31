import { supabase } from "./supabase";

/**
 * 
 * @param {string} name 
 * @param {File} file 
 */
export async function uploadFile(name, file) {
    const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(name, file);

    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo.', error);
        throw new Error(error.message);
    }
}