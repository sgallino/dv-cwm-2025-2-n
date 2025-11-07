<script setup>
import { computed } from 'vue';
import { getFileURL } from '../../services/storage';
import NoImage from '/no-image.jpg';

const props = defineProps({
    user: {
        type: Object,
        required: true,
    }
});

const photoFinalPath = computed(() => props.user.photo_url ? getFileURL(props.user.photo_url) : NoImage);
// const photoFinalPath = computed(() => props.user.photo_url ? getFileURL(props.user.photo_url) : '/no-image.jpg');
</script>

<template>
    <div class="flex gap-4 mb-6">
        <div class="w-1/4">
            <img
                :src="photoFinalPath"
                alt=""
            >
            <!-- 
            Si queremos referenciar archivos que están en la carpeta [public] solamente necesitamos vincularlos de
            manera relativa a la raíz. Por ejemplo:
                /{nombreDelAssetEnPublic}
            -->
            <!-- <img
                v-else
                :src="NoImage"
                alt=""
            > -->
        </div>
        <div class="w-3/4">
            <div class="ms-4 my-6 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>

            <dl>
                <dt class="font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="font-bold">Nombre</dt>
                <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>
</template>