<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';

let unsubscribeFromAuth = () => {}

export default {
    name: 'MyProfile',
    components: { AppH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    mounted() {
        // Guardamos la función para cancelar la suscripción.
        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => this.user = userState);
    },
    unmounted() {
        // Cancelamos la suscripción.
        unsubscribeFromAuth();
    },
}
</script>

<template>
    <div class="flex items-end gap-4">
        <AppH1>Mi perfil</AppH1>
        <RouterLink to="/mi-perfil/editar" class="mb-4 text-blue-700 underline">Editar</RouterLink>
    </div>

    <div class="ms-4 my-6 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="font-bold">Nombre</dt>
        <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
        <dt class="font-bold">Carrera</dt>
        <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
    </dl>
</template>