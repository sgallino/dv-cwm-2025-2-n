import { supabase } from "./supabase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profiles";

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
    display_name: null,
    bio: null,
    career: null,
}
let observers = [];

// Cargamos nuestros datos de localStorage, para marcar al usuario ya como autenticado desde el comienzo,
// si existen esos datos.
// Esto no reemplaza la funcionalidad de loadCurrentUserAuthState(), ya que eso chequea contra el backend.a
// Esto es un "fix" para que no se nos mande al login si ya estoy autenticado.
if(localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
}

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

    // Cargamos el perfil extendido del usuario.
    loadUserFullProfile();
}

async function loadUserFullProfile() {
    setUser(await getUserProfileById(user.id));
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function register(email, password) {
    try {
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

        // Creamos el perfil del usuario.
        await createUserProfile({
            id: data.user.id,
            email: data.user.email,
        });

        setUser({
            id: data.user.id,
            email: data.user.email,
        });
    } catch (error) {
        // TODO...
    }
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

    // Dejamos cargando en paralelo el resto de los datos del perfil.
    loadUserFullProfile();
}

export async function logout() {
    supabase.auth.signOut();

    setUser({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
    });
}

/**
 * 
 * @param {{display_name?: String|null, bio?: String|null, career?: String|null}} data  
 */
export async function updateAuthUserProfile(data) {
    try {
        await updateUserProfile(user.id, data);

        // Actualizamos los datos locales y notificamos.
        setUser(data);
    } catch (error) {
        // TODO...
    }
}


/*--------------------------------------------------------------------------
| Implementación de nuestro observer
+---------------------------------------------------------------------------*/
/**
 * 
 * @param {(userState: {id: String|null, email: String|null}) => void} callback 
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToAuthStateChanges(callback) {
    // El callback sería el observer.
    // Cuando un observer se suscribe, lo registramos en nuestra lista de observers.
    // Y también, lo notificamos inmediatamente de los datos actuales del estado de autenticación, de manera
    // pueda instantáneamente reaccionar al valor inicial.
    observers.push(callback);

    // console.log("Observer agregado. El stack actual es: ", observers);

    notify(callback);

    // Siempre que hacemos un sistema de suscripciones, es crítico que brindemos una forma de cancelar la
    // suscripción ("unsubscribe").
    // De no hacerlo, corremos el riesgo de, entre otras cosas, tener un "memory leak".
    // La forma tradicional es retornar una nueva función que desuscriba al observer cuando se ejecute.
    return () => {
        observers = observers.filter(obs => callback !== obs);
        
        // console.log("Observer removido. El stack actual es: ", observers);
    }
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

    if(user.id) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }

    notifyAll();
}