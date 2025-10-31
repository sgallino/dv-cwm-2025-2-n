<script setup>
import { useRoute } from 'vue-router';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import useUserProfile from '../composables/useUserProfile';

const route = useRoute();

const { user, loading } = useUserProfile(route.params.id);
</script>

<template>
    <template v-if="!loading">
        <div class="flex items-end gap-4">
            <AppH1>Perfil de {{ user.email }}</AppH1>
        </div>

        <div class="ms-4 my-6 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

        <dl class="mb-4">
            <dt class="font-bold">Email</dt>
            <dd class="mb-2">{{ user.email }}</dd>
            <dt class="font-bold">Nombre</dt>
            <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
            <dt class="font-bold">Carrera</dt>
            <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
        </dl>

        <hr class="mb-4">

        <RouterLink
            class="text-blue-700 underline"
            :to="`/usuario/${user.id}/chat`"
        >
            Iniciar conversación privada con {{ user.email }}
        </RouterLink>
    </template>
    <template v-else>
        <AppLoader />
    </template>
</template>