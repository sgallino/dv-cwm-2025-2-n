import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthStateChanges } from "../services/auth";

export function useAuthUserState() {
    let unsubscribeFromAuth = () => {}

    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
        photo_url: null,
    });

    onMounted(() => unsubscribeFromAuth = subscribeToAuthStateChanges(userState => user.value = userState));
    onUnmounted(() => unsubscribeFromAuth());

    return {
        user,
    }
}