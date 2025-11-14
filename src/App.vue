<script setup>
import { provide, ref } from 'vue';
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';
import { globalFeedbackProviderKey } from './symbols/provider-keys';

const feedback = ref({
    message: null,
    type: 'success',
});

function updateFeedback(newFeedback) {
    if(typeof newFeedback !== 'object') throw new Error("El nuevo feedback debe ser un objeto.");

    feedback.value = newFeedback;
}

function clearFeedback() {
    feedback.value.message = null;
}

// Declaramos que proveemos una dependencia "global-feedback" que va a permitir interactuar con el feedback de este
// componente.
// Para hacerlo, usamos la función "provide".
// Recibe 2 parámetros:
// 1. La clave de identificación.
// 2. El contenido que "compartimos".
// Con respecto al contenido que compartimos, en general la recomendación es no compartir valores reactivos 
// directamente.
// ¿Por qué no?
// Es problématico porque cualquier descendiente puede inyectar este valor y asignarle lo que se le dé la gana a
// la varaible. No tenemos forma de controlar qué se le asigna. Con lo cual, es bastante simple que un subcomponente
// rompa (inadvertidamente) la funcionalidad.
// Y no solo eso, sino que puede ser muy complicado encontrar quién es el culpable de hacer este cambio.
// En su lugar, se recomienda solo pasar:
// - Valores constantes.
// - Pasar funciones.
// - Pasar variables de solo lectura (por ejemplo, usando la función readonly() de Vue).
// Y con respecto a las claves, hay también un par de recomendaciones a seguir:
// - Usar una variable exportada de alguna fuente única para el identificador.
// - Usar un "Symbol" como clave, y no un string.
// provide('global-feedback', {
provide(globalFeedbackProviderKey, {
    updateFeedback,
});
</script>

<template>
    <AppNavbar />
    <main class="container mx-auto p-4">
        <div
            v-if="feedback.message !== null"
            class="flex justify-between p-4 mb-4 rounded"
            :class="{
                'bg-red-100': feedback.type === 'error',
                'bg-green-100': feedback.type === 'success',
            }"
        >
            {{ feedback.message }}
            <button 
                class="p-4 -m-4"
                @click="clearFeedback"
            >&times;</button>
        </div>

        <!-- 
        El componente "RouterView" no necesita importarse. Se registra
        globalmente en todos los componentes cuando registramos el
        router en la aplicación.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>