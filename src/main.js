/*
# Rutas en los imports de scripts procesados por npm (y Vite)
Cuando nosotros queremos importar el contenido de un paquete de npm
que hayamos instalado, como podría ser el createApp del paquete de
'vue', podemos hacerlo con la siguiente sintaxis:
  import { createApp } from "vue";

Esto funciona, porque cualquier ruta que indiquemos en el import que
no empiece con un directorio se considera automáticamente como el nombre
de un paquete de npm que debe estar instalado.

Si queremos importar archivos propios, que no sean paquetes descargados
de npm, siempre tenemos que empezar con algún directorio. Por ejemplo:
- /
- ./
- ../

Es decir, que si queremos importar el archivo de [App.vue]:
  import App from "./App.vue";

Noten que agregamos el "./" delante.
Si no lo ponen, y en su lugar escriben:
  import App from "App.vue";

No va a funcionar. Va a buscar un paquete de npm llamado "App.vue" que
debería estar instalado y figurar en la carpeta de [node_modules].
*/
// import './bootstrap.min.css';
import './style.css';
import { createApp } from "vue";
import router from './router/router';
import App from "./App.vue";

const app = createApp(App);
app.use(router); // Registramos el router en nuestra app.
app.mount('#app');
