// El [vite.config.js] es el archivo de configuración de Vite.
// Como todos los archivos de configuración que usan la extensión de
// ".config.js", debe exportar por defecto un objeto de configuración.

// Para instalar el plugin de Vue para Vite corrimos el comando:
//  npm install --save-dev @vitejs/plugin-vue@6

// ¿Qué implica el flag "--save-dev"?
// Este flag (al igual que su sintaxis alternativa "-D") indica que
// el paquete debe instalarse como una "dependencia de desarrollo". En
// inglés, "dev dependency".

// ¿Qué diferencia tiene una "devDependency" y una "dependency" común?
// En qué entorno de ejecución debería incluirse.
// Las "dev dependencies" indican que solo hay que instalar esos 
// paquetes si estamos corriendo en entornos de desarrollo o testing.
// Pero no es entorno de "producción".
// Las "dependencies" comunes se deben instalar siempre.
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default {
    // La propiedad "plugins" permite registrar un array de plugins
    // para Vite.
    plugins: [vue(), tailwindcss()],
}