<script setup>
import AppH1 from '../components/AppH1.vue';

// Con la Composition API no necesitamos (ni podemos) exportar el componente nosotros. El "export default" se agrega
// en la compilación automáticamente.
// Esto nos permite acceder a, entre otras cosas, los componentes que importamos directamente en el template, sin
// tener que agregarlos a la lista de "components".
</script>

<template>
    <AppH1>Les damos la bienvenida a DV Social</AppH1>
    <p>Desde acá podés comunicarte con tus compañeros, personal de la Escuela, docentes, etc.</p>
</template>