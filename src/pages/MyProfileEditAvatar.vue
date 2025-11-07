<script setup>
import { onUnmounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { updateAuthUserAvatar } from '../services/auth';
import { useAuthUserState } from '../composables/useAuthUserState';

const { user } = useAuthUserState();
const { imageData, loading, handleSubmit, handleImageChange } = useProfileEditAvatarForm();

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
        imageData.value.file = event.target.files[0];

        if(imageData.value.preview) {
            URL.revokeObjectURL(imageData.value.preview);
            imageData.value.preview = null;
        }

        if(!imageData.value.file) {
            return;
        }

        /*
            Para hacer la previsualización de la imagen necesitamos poder leer el contenido de la imagen en memoria
            de manera que podamos asignar ese contenido al tag <img>.
            Hay más de una manera de lograrlo. La forma más simple es, probablemente, usando el método 
            URL.createObjectURL().
            Este método recibe como parámetro un File o Blob. Retorna una URL "local" para ver el archivo.
            La forma exacta en que funciona es:
                - Leyendo el contenido del archivo en memoria.
                - Asignando ese contenido a una URL en el dominio actual.
                - Asociando esa URL al *document* de la página.
            
            Esto último es especialmente importante.
            ¿Por qué?
            Que cada archivo al que le creemos una ObjectURL se asigne al document, implica que el browser no 
            puede liberar la memoria que ocupan esos archivos hasta que el document se descargue (que el usuario
            refresque o navegue a otra pantalla).
            En una MPA tradicional, esto no supone mayor inconveniente. Las páginas duran relativamente poco tiempo
            en el browser.
            Pero es distinto en una SPA. En este tipo de aplicaciones las pantallas pueden vivir largo tiempo. Las
            navegaciones no refrescan la página ni hacen una verdadera navegación. "Solo" cambiamos el contenido con
            JS. Que es la gracia por la que se popularizaron.
            Esto genera un gran riesgo de tener importantes "memory leaks".
            Para poder evitar esto, es que URL nos ofrece el método revokeObjectURL() que nos permite desvincular
            una URL del document. De esa forma, el browser va a poder liberar la memoria.
            Es muy simple de aplicar, lo único "complicado" es asegurarnos de no olvidarnos de hacerlo cada vez
            que ya no necesitemos el recurso. Que, en este caso, son dos situaciones:
            - Navegamos a otra ruta.
            - Cambiamos la imagen que se muestra.
        */
        imageData.value.preview = URL.createObjectURL(imageData.value.file);
    }

    onUnmounted(() => {
        if(imageData.value.preview) {
            URL.revokeObjectURL(imageData.value.preview);
        }
    });

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

    <div class="flex gap-4">
        <form 
            action="#"
            class="w-1/2"
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
        <div class="w-1/2">
            <h2 class="text-lg">Imagen seleccionada</h2>
            <img
                v-if="imageData.preview"
                :src="imageData.preview" 
                alt=""
            >
            <span v-else>No hay una imagen seleccionada</span>
        </div>
    </div>
</template>