<script>
import AppH1 from '../components/AppH1.vue';
import AppLoader from '../components/AppLoader.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchGlobalChatLastMessages, sendGlobalChatNewMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';

let unsubscribeFromAuth = () => {}
let unsubscribeFromChat = () => {}

export default {
    name: 'GlobalChat',
    components: { AppH1, AppLoader, },
    // data nos permite definir el "state" del componente.
    // Entendemos por "state" los valores que son propios del componente y que pueden variar
    // con el tiempo.
    // En Vue, estamos valores son "reactivos", lo que significa que Vue actualiza el HTML
    // re-renderizando el <template> cada vez que estos valores cambien.
    // Para registrar los valores, data debe recibir una función que retorne un array con los
    // valores iniciales del "state".
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
        }
    },
    methods: {
        async handleSubmit() {
            try {
                await sendGlobalChatNewMessage({
                    sender_id: this.user.id,
                    email: this.user.email,
                    content: this.newMessage.content,
                });
            } catch (error) {
                // TODO ...
            }

            this.newMessage.content = '';
        }
    },
    async mounted() {
        this.loadingMessages = true;

        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => this.user = userState);

        unsubscribeFromChat = subscribeToGlobalChatNewMessages(async newMessage => {
            this.messages.push(newMessage);
            
            await this.$nextTick();
            
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        });
        
        this.messages = await fetchGlobalChatLastMessages();
        
        this.loadingMessages = false;

        // $refs es la propiedad especial de la Options API que contiene todas las template
        // refs del componente.
        // console.log("Alto del contenedor del chat antes del $nextTick es: ", this.$refs.chatContainer.scrollHeight);
        
        /*
            ¿Qué hace el nextTick?
            Una de las tareas más exigentes que pueden tener que realizar los browsers es 
            dibujar / renderizar (paint) la página.
            Por esta razón, es que Vue no actualiza el DOM apenas tiene alguna indicación de
            hacerlo.
            Por ejemplo, cuando lo agregamos los nuevos mensajes de chat, eso implica que 
            tiene que actualizar el DOM, para actualizar la lista de HTML.
            Pero no lo hace de una. Sino que espera un rato para ver si hay más cambios que
            se pidan sobre el DOM.
            Trata de hacer un "batch" de múltiples cambios para aplicarlos todos juntos,
            y ahorrar repaintings.

            Típicamente, esto puede pasar desapercibido por nosotros. Vue es bastante hábil
            en cómo maneja este tipo de repaintings.

            Pero hay circunstancias donde nosotros necesitamos explícitamente esperar a que
            alguna modificación del DOM se realice antes de proceder. Como es este caso de
            actualizar la ubicación del scroll.

            Eso es lo que nextTick() hace. Retorna una Promise que se resuelve cuando Vue
            ejecuta un repainting a través de modificar el DOM.
        */
        await this.$nextTick();
        
        // console.log("Alto del contenedor del chat después del $nextTick es: ", this.$refs.chatContainer.scrollHeight);
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
    },
    unmounted() {
        unsubscribeFromAuth();
        unsubscribeFromChat();
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