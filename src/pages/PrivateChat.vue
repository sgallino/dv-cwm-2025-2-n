<script>
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import AppButton from '../components/AppButton.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchGlobalChatLastMessages, sendGlobalChatNewMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { getUserProfileById } from '../services/user-profiles';
import { fetchPrivateChatLastMessages, sendPrivateChatMessage, subscribeToPrivateChatNewMessages } from '../services/private-chat';

let unsubscribeFromAuth = () => {}
let unsubscribeFromChat = () => {}

export default {
    name: 'PrivateChat',
    components: { AppH1, AppLoader, AppButton, },
    data() {
        return {
            messages: [],
            loadingMessages: false,

            newMessage: {
                content: '',
            },
            
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },

            otherUser: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loadingUser: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                await sendPrivateChatMessage(
                    this.user.id,
                    this.$route.params.id,
                    this.newMessage.content,
                );
            } catch (error) {
                // TODO ...
            }

            this.newMessage.content = '';
        }
    },
    async mounted() {
        try {
            this.loadingMessages = true;
            this.loadingUser = true;

            unsubscribeFromAuth = subscribeToAuthStateChanges(userState => this.user = userState);
            
            getUserProfileById(this.$route.params.id)
                .then(userProfile => {
                    this.otherUser = userProfile;
                    this.loadingUser = false;
                });

            unsubscribeFromChat = await subscribeToPrivateChatNewMessages(
                this.user.id,
                this.$route.params.id,
                async newMessage => {
                    this.messages.push(newMessage);
        
                    await this.$nextTick();
                    
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                });
            
            fetchPrivateChatLastMessages(this.user.id, this.$route.params.id)
                .then(async newMessages => {
                    this.messages = newMessages;
                    this.loadingMessages = false;
                
                    await this.$nextTick();
                    
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                });
        } catch (error) {
            this.loadingUser = false;
            this.loadingMessages = false;
        }
    },
    unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
    }
}
</script>

<template>
    <AppH1>Chat privado con {{ otherUser.email }}</AppH1>

    <section class="overflow-y-auto h-100 p-4 mb-4 border border-gray-200 rounded" ref="chatContainer">
        <h2 class="sr-only">Lista de mensajes</h2>
        <template v-if="!loadingMessages">
            <ol class="flex flex-col items-start gap-4">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-4 rounded"
                    :class="{
                        'bg-gray-100': user.id !== message.sender_id,
                        'self-end bg-green-100': user.id === message.sender_id,
                    }"
                >
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </template>
        <template v-else>
            <AppLoader />
        </template>
    </section>
    <section>
        <h2 class="sr-only">Enviar un mensaje</h2>
        <form
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <label for="content" class="sr-only">Mensaje</label>
            <textarea
                id="content"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="newMessage.content"
            ></textarea>
            <AppButton type="submit">Enviar</AppButton>
        </form>
    </section>
</template>