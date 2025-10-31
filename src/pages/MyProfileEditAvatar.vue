<script setup>
import { ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { updateAuthUserAvatar } from '../services/auth';
import { useAuthUserState } from '../composables/useAuthUserState';

const { user } = useAuthUserState();
const { imageData, loading, handleSubmit, handleImageChange } = useProfileEditAvatarForm();

// TODO: Agregar el campo para la imagen en la tabla de users. Asociar la imagen al usuario. Mostrar la imagen. 
// Mostrar un preview para el upload.

function useProfileEditAvatarForm() {
    // let unsubscribeFromAuth = () => {}
    const imageData = ref({
        file: null,
        preview: null,
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            if(!imageData.value.file) return; // TODO: Mostrar mensaje de error.

            loading.value = true;

            await updateAuthUserAvatar(imageData.value.file);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    function handleImageChange(event) {
        // Como todo evento nativo, vamos a recibir el objeto Event como parámetro.
        // Los inputs de tipo "file" tienen una propiedad llamada "files", que es de tipo FileList.
        // FileList es, en esencia, un array de objeto File.
        // Salvo que el campo del <input> tenga el atributo "multiple" solo puede tener un único
        // archivo, por lo cual podemos hard-codear la posición 0.
        // El objeto File contiene los datos propios del archivo. Esto incluye:
        // - El nombre.
        // - El peso.
        // - El tipo MIME.
        const file = event.target.files[0];

        if(!file) {
            imageData.value.file = null;
            return;
        }

        imageData.value.file = file;
    }

    return {
        imageData,
        loading,
        handleSubmit,
        handleImageChange,
    }
}
</script>

<template>
    <AppH1>Actualizar mi foto de perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="image" class="block mb-1">Imagen</label>
            <input
                type="file"
                id="image"
                class="w-full p-2 border border-gray-300 rounded"
                @change="handleImageChange"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">
            <template v-if="!loading">
                Actualizar mi foto
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </button>
    </form>
</template>