<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
    name: 'GlobalChat',
    components: { AppH1, },
    // data nos permite definir el "state" del componente.
    // Entendemos por "state" los valores que son propios del componente y que pueden variar
    // con el tiempo.
    // En Vue, estamos valores son "reactivos", lo que significa que Vue actualiza el HTML
    // re-renderizando el <template> cada vez que estos valores cambien.
    // Para regsitrar los valores, data debe recibir una función que retorne un array con los
    // valores iniciales del "state".
    data() {
        return {
            messages: [],
            newMessage: {
                email: '',
                content: '',
            }
        }
    },
    methods: {
        handleSubmit() {
            this.messages.push({
                id: this.messages.length,
                email: this.newMessage.email,
                content: this.newMessage.content,
                created_at: new Date(),
            });

            this.newMessage.content = '';
        }
    },
    async mounted() {
        // El cliente de Supabase tiene métodos para trabajar con sus distintos servicios.
        // El método "from()" permite interactuar con una tabla.
        // Presten especial atención al "await".
        // Podemos considerar que el "await" es el que ejecuta el query.
        const { data, error } = await supabase
            // .from() recibe el nombre de la tabla sobre la que queremos hacer consultas,
            // y retorna un objeto con métodos para ejecutar esas consultas.
            .from('global_chat_messages')
            // .select() realiza un SELECT.
            .select();

        if(error) {
            throw new Error(error); // TODO: Manejar
        }

        this.messages = data;
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
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
                    <div class="mb-1"><span class="font-bold">{{ message.email }}</span> dijo:</div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>
            <form
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <label for="email" class="block mb-1">Email</label>
                    <!-- 
                    v-model genera un "two-way data binding".
                    Esto significa que Vue mantiene en sincronía el valor del state y del control
                    (campo) del form.
                    Si el "state" cambia, Vue actualiza el valor del campo.
                    Si el usuario cambia el valor del campo, Vue actualiza el "state".
                    -->
                    <input
                        type="email"
                        id="email"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-1">Mensaje</label>
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