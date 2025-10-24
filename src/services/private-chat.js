import { supabase } from "./supabase";

// Armamos un simple sistemita para cachear los registros de los chats privados, para no tener
// que buscarlos varias veces.
// En este objeto vamos a guardar cada registro de chat privado, asociándolo a una clave que
// va a tener formato "userid1_userid2".
let privateChatCache = {};

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {{id: number, user_id1: string, user_id2: string, created_at: string}} data 
 */
function addToPrivateChatCache(senderId, receiverId, data) {
    const cacheKey = [senderId, receiverId].sort().join('_');
    privateChatCache[cacheKey] = data;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {{id: number, user_id1: string, user_id2: string, created_at: string}|null}
 */
function getFromPrivateChatCache(senderId, receiverId) {
    const cacheKey = [senderId, receiverId].sort().join('_');
    return privateChatCache[cacheKey] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function createPrivateChat(senderId, receiverId) {
    // Ordenamos los ids para asegurarnos una consistencia en el orden de los mismos.
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userId1,
            user_id2: userId2,
        })
        .select();

    if(error) {
        console.error("[private-chat.js createPrivateChat] Error al crear el chat privado: ", error);
        throw new Error(error.message);
    }

    return data[0];
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}|null>}
 */
async function getPrivateChatFor(senderId, receiverId) {
    const [userId1, userId2] = [senderId, receiverId].sort();
 
    const { data, error } = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', userId1)
        .eq('user_id2', userId2);

    if(error) {
        console.error("[private-chat.js getPrivateChatFor] Error al buscar el chat privado: ", error);
        throw new Error(error.message);
    }

    return data[0] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function getOrCreatePrivateChatFor(senderId, receiverId) {
    // Empezamos por buscar el chat privado en el caché.
    const cachedChat = getFromPrivateChatCache(senderId, receiverId);
    if(cachedChat) return cachedChat;

    let privateChat = await getPrivateChatFor(senderId, receiverId);

    if(privateChat === null) {
        privateChat = await createPrivateChat(senderId, receiverId);
    }

    // Guardamos en el caché el chat privado.
    addToPrivateChatCache(senderId, receiverId, privateChat);

    return privateChat;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} content 
 */
export async function sendPrivateChatMessage(senderId, receiverId, content) {
    // Para poder grabar el mensaje, necesitamos tener antes el registro del chat privado.
    const privateChat = await getOrCreatePrivateChatFor(senderId, receiverId);

    // Ahora sí, podemos insertar el mensaje.
    const { error } = await supabase
        .from('private_chat_messages')
        .insert({
            chat_id: privateChat.id,
            sender_id: senderId,
            content,
        });

    if(error) {
        console.error("[private-chat.js sendPrivateChatMessage] Error al enviar el mensaje de chat privado: ", error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, chat_id: number, sender_id: string, content: string, created_at: string}[]>}
 */
export async function fetchPrivateChatLastMessages(senderId, receiverId) {
    const privateChat = await getOrCreatePrivateChatFor(senderId, receiverId);

    const { data, error } = await supabase
        .from('private_chat_messages')
        .select()
        .eq('chat_id', privateChat.id)
        /*.limit(10)*/;
    
    if(error) {
        console.error("[private-chat.js fetchPrivateChatLastMessages] Error al traer los mensajes del chat privado: ", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {(newMessage: {id: number, chat_id: number, sender_id: string, content: string, created_at: string}) => void} callback 
 * @returns {Promise<() => void>}
 */
export async function subscribeToPrivateChatNewMessages(senderId, receiverId, callback) {
    const privateChat = await getOrCreatePrivateChatFor(senderId, receiverId);

    // Preparamos el canal para las actualizaciones en tiempo real.
    const privateChannel = supabase.channel('private_chat_messages');

    privateChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            table: 'private_chat_messages',
            // Filtramos para indicar qué mensajes son los que nos interesan.
            // Noten la sintaxis del filter.
            // Escribimos el campo por el que queremos filtrar, seguido de un igual,
            // seguido del operador de Supabase que queremos usar (eq => equals), 
            // seguido de un punto, seguido del valor.
            filter: 'chat_id=eq.' + privateChat.id,
        },
        payload => {
            callback(payload.new);
        }
    );

    privateChannel.subscribe();

    return () => {
        privateChannel.unsubscribe();
    }
}

// async function testICantReadPrivateChatsInWhichImNotIn() {
//     const pepeEmail = 'a2c27592-3b42-4d21-aad6-b31e075b4541';
//     const saraEmail = 'c2ecaa55-5207-427b-8741-32c2b5c16805';

//     const { data, error } = await supabase
//         .from('private_chats')
//         .select()
//         .eq('user_id1', pepeEmail)
//         .eq('user_id2', saraEmail);

//     if(error) {
//         console.warn('❌ [Test] Error al tratar de leer el mensaje de chat.');
//         return;
//     }

//     if(data.length === 0) {
//         console.log('✔ [Test] No podemos leer una conversación en la cual no participamos.');
//     } else {
//         console.warn('❌ [Test] Podemos leer una conversación en la cual no participamos.');
//     }
// }

// testICantReadPrivateChatsInWhichImNotIn();