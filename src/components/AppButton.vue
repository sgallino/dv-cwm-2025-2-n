<script setup>
import { computed } from 'vue';
import AppLoader from './AppLoader.vue';

// Para definir las "props" que un componente recibe usamos la "macro" defineProps(), que recibe como arugmento
// lo mismo que asignaríamos a la propiedad "props".
// Si queremos usar las propiedades en el <script>, capturamos el retorno del defineProps() en una variable.
// Nota: Podemos ver que no estamos importando "defineProps()". La razón es que defineProps no es una función, es
// una macro. En Vue, las "macros" son instrucción para el compilador, que van a ser transformados.
const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
    loading: {
        type: Boolean,
        default: false,
    }
});

// Para las propiedades computadas usamos la función computed() que recibe un callback.
const buttonColor = computed(() => {
    switch(props.variant) {
        case 'secondary':
            return 'bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700';

        case 'success':
            return 'bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700';

        case 'danger':
            return 'bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700';

        case 'primary':
        default:
            return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700';
    }
});
</script>

<template>
    <button 
        :class="`transition px-4 py-2 rounded cursor-pointer ${buttonColor} text-white`"
    >
        <slot v-if="!loading" />
        <AppLoader v-else />
    </button>
</template>