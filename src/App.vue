<script>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    // "components" recibe un objeto con todos los componentes que
    // vamos a utilizar dentro de éste.
    components: { AppNavbar, AppFooter, },
}
</script>

<template>
    <AppNavbar />
    <main class="container mx-auto p-4">
        <!-- 
        El componente "RouterView" no necesita importarse. Se registra
        globalmente en todos los componentes cuando registramos el
        router en la aplicación.
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>