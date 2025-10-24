<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { fetchGlobalChatLastMessages, sendGlobalChatNewMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { useAuthUserState } from '../composables/useAuthUserState';

const { user } = useAuthUserState();
const { messages, loadingMessages } = useGlobalChatMessages();
const { newMessage, handleSubmit } = useGlobalChatNewMessageForm(user);

function useGlobalChatMessages() {
    let unsubscribeFromChat = () => {}

    const messages = ref([]);
    const loadingMessages = ref(false);

    onMounted(async () => {
        const chatContainer = useTemplateRef('chatContainer');
        loadingMessages.value = true;

        unsubscribeFromChat = subscribeToGlobalChatNewMessages(async newMessage => {
            messages.value.push(newMessage);
            
            await nextTick();
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        });
        
        messages.value = await fetchGlobalChatLastMessages();
        
        loadingMessages.value = false;

        await nextTick();
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    });

    onUnmounted(() => unsubscribeFromChat()); // <---- Tenemos que pasar una función porque cambiamos el valor de la variable

    return {
        messages,
        loadingMessages,
    }
}

function useGlobalChatNewMessageForm(user) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        try {
            await sendGlobalChatNewMessage({
                sender_id: user.value.id,
                email: user.value.email,
                content: newMessage.value.content,
            });
        } catch (error) {
            // TODO ...
        }

        newMessage.value.content = '';
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <!-- 
        En Vue, podemos agregarle a los elementos de HTML un atributo "ref" que contenga un identificador.
        Este identificador permite que el elemento del DOM sea accesible en el script a través de una 
        "template ref".
        -->
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded" ref="chatContainer">
            <h2 class="sr-only">Lista de mensajes</h2>
            <template v-if="!loadingMessages">
                <ol class="flex flex-col items-start gap-4">
                    <!-- 
                    v-for es un "directiva".
                    Las directivas son funciones que permiten transformar o modificar de 
                    alguna manera el elemento.
                    -->
                    <li
                        v-for="message in messages"
                        :key="message.id"
                        class="p-4 rounded bg-gray-100"
                    >
                        <div class="mb-1">
                            <RouterLink
                                :to="`/usuario/${message.sender_id}`" 
                                class="font-bold text-blue-700 underline"
                            >
                                {{ message.email }}
                            </RouterLink> 
                            dijo:
                        </div>
                        <div class="mb-1">{{ message.content }}</div>
                        <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                    </li>
                </ol>
            </template>
            <template v-else>
                <AppLoader />
            </template>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span class="block mb-1">Email</span>
                    {{ user.email }}
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
                    <!-- 
                    v-model genera un "two-way data binding".
                    Esto significa que Vue mantiene en sincronía el valor del state y del control
                    (campo) del form.
                    Si el "state" cambia, Vue actualiza el valor del campo.
                    Si el usuario cambia el valor del campo, Vue actualiza el "state".
                    -->
                    <textarea
                        id="content"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>