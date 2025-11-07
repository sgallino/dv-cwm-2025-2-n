import { supabase } from "./supabase";

/**
 * 
 * @param {string} name 
 * @param {File} file 
 * @param {string} bucket
 */
export async function uploadFile(name, file, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(name, file);

    if(error) {
        console.error('[storage.js uploadFile] Error al subir el archivo.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} name 
 * @param {string} bucket 
 */
export async function deleteFile(name, bucket = 'avatars') {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove(name);

    if(error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} name 
 * @param {string} bucket 
 * @returns {string}
 */
export function getFileURL(name, bucket = 'avatars') {
    return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}