<script setup>
import AppH1 from '../components/AppH1.vue';
import { useAuthUserState } from '../composables/useAuthUserState';

const { user } = useAuthUserState();
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