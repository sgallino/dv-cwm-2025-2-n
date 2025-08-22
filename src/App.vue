<script>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    components: { AppNavbar, AppFooter, },
}
</script>

<template>
    <AppNavbar />
    <main class="container py-3">
        <!-- 
        RouterView es un componente global que registra Vue Router, que es donde
        se va a montar el componente que corresponda a la ruta.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>