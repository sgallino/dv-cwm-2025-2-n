<script>
import AppH1 from '../components/AppH1.vue';

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
            }
        }
    }
}
</script>

<template>
    <AppH1>Mi perfil</AppH1>
</template>