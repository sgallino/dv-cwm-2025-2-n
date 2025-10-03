<script>
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { subscribeToAuthStateChanges, updateAuthUserProfile } from '../services/auth';

let unsubscribeFromAuth = () => {}

export default {
    name: 'MyProfileEdit',
    components: { AppH1, AppLoader, },
    data() {
        return {
            formData: {
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;

                await updateAuthUserProfile(this.formData);
            } catch (error) {
                // TODO...
            }
            this.loading = false;
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => {
            this.formData = {
                display_name: userState.display_name,
                bio: userState.bio,
                career: userState.career,
            }
        });
    },
    unmounted() {
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <AppH1>Actualizar mi perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-1">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-1">Nombre</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-1">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.career"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">
            <template v-if="!loading">
                Actualizar
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </button>
    </form>
</template>