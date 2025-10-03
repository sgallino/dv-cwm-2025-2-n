// Este servicio ofrece funciones para interactuar con el chat global.
import { supabase } from "./supabase";

/**
 * 
 * @param {{sender_id: String, email: String, content: String}} data
 */
export async function sendGlobalChatNewMessage({sender_id, email, content}) {
    // Hacemos el insert en la tabla del backend.
    const { data, error } = await supabase
        .from('global_chat_messages')
        .insert({
            sender_id,
            email,
            content,
        });

    if(error) {
        console.error('[global-chat.js sendGlobalChatNewMessage] Error al insertar el nuevo mensaje.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @returns {Promise<{id: String, email: String, content: String, created_at: String}[]>}
 */
export async function fetchGlobalChatLastMessages() {
    // El cliente de Supabase tiene métodos para trabajar con sus distintos servicios.
    // El método "from()" permite interactuar con una tabla.
    // Presten especial atención al "await".
    // Podemos considerar que el "await" es el que ejecuta el query.
    const { data, error } = await supabase
        // .from() recibe el nombre de la tabla sobre la que queremos hacer consultas,
        // y retorna un objeto con métodos para ejecutar esas consultas.
        .from('global_chat_messages')
        // .select() realiza un SELECT.
        .select();

    if(error) {
        console.error('[global-chat.js fetchGlobalChatLastMessages] Error al traer los mensajes.', error);
        throw new Error(error.message); // TODO: Manejar
    }

    return data;
}

/**
 * 
 * @param {(newMessage: {id: String, email: String, content: String, created_at: String}) => void} callback 
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToGlobalChatNewMessages(callback) {
    // Agregamos la recepción de nuevos mensajes en tiempo real, con la ayuda de la API
    // Realtime.
    // En principio, vamos a trabajar con la versión de Postgres Changes.
    // Para empezar, necesitamos crear un canal.
    // Esto necesita recibir un nombre / id que lo identifique.
    const chatChannel = supabase.channel('global_chat_messages');

    // Definimos los eventos que queremos escuchar.
    // Para esto usamos el método "on", que recibe 3 parámetros:
    // 1. String. El servicio de Realtime que queremos usar.
    // 2. Objeto. Los detalles del evento que nos interesa.
    // 3. Función. El callback que queremos ejecutar en cada nueva ocurrencia del evento.
    //  Este callback va a recibir como parámetro el "payload", que son los datos del
    //  evento.
    chatChannel.on(
        'postgres_changes',
        {
            // Definimos el tipo del evento. Para "postgres_changes" puede ser:
            // INSERT, UPDATE, DELETE, *
            event: 'INSERT',
            table: 'global_chat_messages',
            schema: 'public',
        },
        payload => {
            // Ejecutamos el callback que nos pasamos por parámetro.
            callback(payload.new);
        }
    );

    // Finalmente, necesitamos suscribirnos para que esta configuración tenga efecto.
    // Cabe destacar que solo podemos suscribirnos al canal si no estamos ya suscritos.
    chatChannel.subscribe();

    return () => {
        chatChannel.unsubscribe();
    }
}