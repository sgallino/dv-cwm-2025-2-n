import { supabase } from "./supabase";

/*
# Distribuyendo el estado de autenticación con el patrón Observer
El patrón de diseño Observer es uno de los más populares.

https://refactoring.guru/design-patterns/observer

Este patrón sirve para modelar una relación de 1 a muchos entre nuestros elementos.
Específicamente, es una estrategia pensada para resolver el escenario donde tenemos múltiples elementos del
sistema (a los que vamos a llamar "observers") que están interesados en saber los cambios en el estado o en los
acontecimientos relacionados a otro elemento específico (que vamos a llamar el "subject").

La idea es que cada vez que el "subject" cambie, todos los "observers" sean notificados de esto, y puedan ejecutar
el código que deseen en respuesta.
Por ejemplo, que nuestros componentes, el router, otros servicios, etc, puedan recibir cuando cambia el estado
de autenticación para poder actualizar su interfaz o cualquier otra cosa.

Casi todo el trabajo va a ser del "subject".

Cuando un "observer" pide ser notificado de los cambios en el "subject", decimos que se "suscribe" a esos cambios.
En algunos escenarios, se suelen usar términos diferentes. Por ejemplo, es común encontrarse con verbos como
"attach" (adjuntar), "listen" (escuchar) o "watch" (observar).

Requisitos:
- Tener un "subject". En nuestro caso, va a ser una variable con los datos del usuario.
- Tener un listado de los "observers" que están "suscritos". Lo vamos a resolver con un array.
- Tener una función que permita a un "observer" "suscribirse".
- Tener una función que notifique a los "observers" cuando el "subject" cambie.
*/

let user = {
    id: null,
    email: null,
}
let observers = [];

loadCurrentUserAuthState();

async function loadCurrentUserAuthState() {
    const { data, error } = await supabase.auth.getUser();

    if(error) {
        console.warn('No hay un usuario autenticado.');
        return;
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    });
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function register(email, password) {
    // El cliente de Supabase tiene una propiedad "auth" que nos da acceso a la API de autenticación.
    // Contiene varios métodos, como signUp, que nos permite crear una cuenta.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js register] Error al crear un usuario: ', error);
        throw new Error(error.message);
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    });
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw new Error(error.message);
    }

    setUser({
        id: data.user.id,
        email: data.user.email,
    });
}

export async function logout() {
    supabase.auth.signOut();

    setUser({
        id: null,
        email: null,
    });
}


/*--------------------------------------------------------------------------
| Implementación de nuestro observer
+---------------------------------------------------------------------------*/
/**
 * 
 * @param {(userState: {id: String|null, email: String|null}) => void} callback 
 */
export async function subscribeToAuthStateChanges(callback) {
    // El callback sería el observer.
    // Cuando un observer se suscribe, lo registramos en nuestra lista de observers.
    // Y también, lo notificamos inmediatamente de los datos actuales del estado de autenticación, de manera
    // pueda instantáneamente reaccionar al valor inicial.
    observers.push(callback);

    notify(callback);
}

/**
 * 
 * @param {(userState: {id: String|null, email: String|null}) => void} callback 
 */
function notify(callback) {
    callback({...user}); // Noten que pasamos una copia de los datos.
}

/**
 * Notifica a todos los observers registrados.
 */
function notifyAll() {
    // observers.forEach(callback => notify(callback));
    observers.forEach(notify);
}

function setUser(data) {
    user = {
        ...user,
        ...data,
    }
    notifyAll();
}