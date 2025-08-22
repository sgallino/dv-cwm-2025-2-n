/*
# Uso de rutas en los imports de npm
Cuando hacemos un import de un archivo sin especificar un directorio de origen,
npm asume automáticamente que estamos hablando de un paquete de npm instalado
y que exista en la carpeta de [node_modules].

Por eso es que podemos hacer algo así:
  import { createApp } from "vue";

Esto implica que si queremos importar de un archivo local que no sea un 
paquete de npm, es imperativo que lo hagamos prefijando un directorio de origen.
Como ser:
  - /
  - ./
  - ../

Es decir, que deberíamos hacer algo como:
  import App from "./App.vue";

Si no ponemos ese prefijo, y tratamos de hacer:
  import App from "./App.vue";

No funciona. Porque npm va a buscar una carpeta [App.vue] en [node_modules].
*/
import "./bootstrap.min.css";
import "./style.css";
import { createApp } from "vue";
import router from "./router/router";
import App from "./App.vue";

const app = createApp(App);
app.use(router); // Registramos el router en la aplicación.
app.mount('#app');