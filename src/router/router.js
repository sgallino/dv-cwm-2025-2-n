// Archivo de definición de rutas.
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import GlobalChat from '../pages/GlobalChat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyProfile from '../pages/MyProfile.vue';
import { subscribeToAuthStateChanges } from '../services/auth';

// Definimos las rutas.
// Esto lo hacemos con un array de objetos "Route".
// Estos objetos deben tener al menos 2 propiedades:
// - path. La URL de la ruta a partir de la raíz del sitio.
// - component. El componente que debe renderizarse para esta ruta.
// Adicionalmente, podemos pasar otras propiedades.
// - meta. Un objeto con meta data para la ruta. Esto es, valores arbitrarios que queramos asociar a una ruta.
const routes = [
    { path: '/',                            component: Home, },
    { path: '/ingresar',                    component: Login, },
    { path: '/crear-cuenta',                component: Register, },
    { path: '/chat',                        component: GlobalChat,      meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',                   component: MyProfile,       meta: { requiresAuth: true, }, },
];

// Procedemos a crear el router en sí con la función createRouter.
// Esta función recibe un objeto con 2 propiedades:
// - routes. Un array de objetos "Route" con las rutas.
// - history. Un objeto con el modo de manejo de la historia de 
//      navegación. Pueden crearse con las funciones:
//      a. createWebHistory
//      b. createWebHashHistory
// El primero maneja el historial de navegación con ayuda de la
// API de navegación de JS para que las rutas queden como si fueran
// páginas "reales".
// El segundo maneja el historial de navegación usando los "hashes",
// es decir, el "#", para indicar la pantalla.
// Por ejmplo, con createWebHistory las rutas quedarían:
//  - /
//  - /chat
//  - /ingresar
//  - /crear-cuenta
//
// Mientras que con createWebHashHistory quedarían:
//  - /#/
//  - /#/chat
//  - /#/ingresar
//  - /#/crear-cuenta
//
// ¿Cuál es mejor?
// Las rutas de createWebHistory son más limpias, y además son mucho
// mejores para el SEO de la página.
// Pero requieren de un servidor configurado especialmente para
// poder funcionar.
// Las rutas creadas con createWebHashHistory no tienen este 
// requerimiento, y funcionan siempre.
// Si necesitamos optimizar la página para SEO, se vuelve muy importante
// ir por el primer escenario, y configurar el servidor acordemente.
// Si la página es una intranet, o está completamente detrás de un 
// login, entonces podemos optar por el HashHistory si lo preferimos.
const router = createRouter({
    routes,
    history: createWebHistory(),
});

// Restringimos el acceso a rutas que requieren que el usuario esté autenticado.
let user = {
    id: null,
    email: null,
}

subscribeToAuthStateChanges(userState => user = userState);

// Ahora agregamos la lógica usando los "guards globales" de Vue Router.
// Los "navigation guards" permiten controlar si permitimos que ocurra una navegación a una nueva ruta,
// si lo prohibimos (retornando false) o si redireccionamos a otra ruta (retornamos una ruta o una URL).
// Cada guard va a ser una función que recibe 2 parámetros:
// 1. RouteNormalized. La ruta hacia la cual se está tratando de navegar.
// 2. RouteNormalized. La ruta desde la que se navegando.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return '/ingresar';
    }

    // console.group('🚦 Router');
    // console.log("Ruta desde la que inicia la navegación: ", from);
    // console.log("Ruta a la que se está navegando: ", to);
    // console.groupEnd('🚦 Router');
});

export default router;