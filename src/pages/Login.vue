<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth';

// Algo clave de recordar en la Composition API es que no tenemos acceso a "this". A esta altura, el componente no
// se instanció todavía.
// Todo lo que hacíamos a través de "this" cambia a uso de funciones.
// Esto es especialmente importante en las propiedades especiales como "$router", "$route", "$refs", "$nextTick".
// Por ejemplo, si queremos usar el router, tenemos que obtener usando el "composable" useRouter() de Vue Router.
const router = useRouter();

const { user, loading, handleSubmit } = useLoginForm(router);

// La práctica recomendada en la Composition API es que cada responsabilidad lógica quede englobada en una función.
// Estas funciones, por convención, suelen empezar con "use", utilizan instrucciones del core de Vue (como ref),
// y se conocen como "composables".
// Los composables retornan los datos que queremos que el componente en sí utilice.
// Y, por su lado, el componente ejecuta los composables al comienzo.
// Este formato de trabajo tiene varios beneficios:
// 1. Organiza la lógica en diferentes funciones. Haciendo que sea fácil saber qué pertenece a qué responsabilidad.
// 2. Facilita el testeo. Son funciones independientes.
// 3. Facilita la reutilización de código a futuro. Es fácil hacer que una función esté en un archivo externo que
//  otros puedan utilizar.
// 4. Evita la contaminación ("pollution") del espacio global del componente. Evitando así colisiones de nombres
//  de variables o funciones.
// Finalmente, no queremos que los composables usen variables externas a la función.
// Si tienen una dependencia (como el router, en este caso) deberían recibirlas como parámetro.
function useLoginForm(router) {
    // Para definir valores del "state" (lo que es el "data" de Options API) nosotros podemos usar alguna de las 
    // funciones de Vue para este fin. La más recomendada en la mayoría de los casos es "ref()" ("reactive reference").
    // ref() va a retornarnos algo muy similar a un objeto que envuelve al valor en una propiedad "value". Es decir,
    // si hacemos:
    //  const saludo = ref("Hola");
    // Tenemos algo similar a:
    //  const saludo = { value: "Hola" }
    // Estrictamente hablando, el objeto está dentro de un Proxy.
    // Esto es importante porque va a implicar que todos los uso de una variable creada con ref() van a tener que llevar
    // un ".value" para acceder al valor (al menos, dentro del <script>, en el <template> no hace falta).
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);

    // Los "methods" se definen como funciones comunes.
    async function handleSubmit() {
        try {
            loading.value = true;

            await login(user.value.email, user.value.password);
        
            router.push('/mi-perfil');
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

    <form
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-1">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password"
            >
        </div>
        <AppButton 
            type="submit"
            variant="secondary"
        >Ingresar</AppButton>
    </form>
</template>