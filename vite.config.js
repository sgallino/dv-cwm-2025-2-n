// Este es el archivo de configuración de Vite.
// Como todo archivo [.config.js] debe exportar un objeto de configuración.
// Este paquete del plugin lo podemos instalar:
//  npm install --save-dev @vitejs/plugin-vue
//
// ¿Qué significa el flag "--save-dev" (o "-D")?
// Que queremos que registre este paquete como una "dependencia de desarrollo".
//
// ¿Qué diferencia tiene una dependencia común de una de desarrollo?
// La diferencia es en qué entornos de ejecución queremos que cada paquete se
// instale.
// Las dependencias comunes se instalan siempre.
// Las dependencias de desarrollo solo se instalan en entornos de desarrollo
// o testing. No así en los entornos de producción.
import vue from '@vitejs/plugin-vue';

export default {
    // La propiedad "plugins" recibe un array de los plugins para Vite.
    // Cada plugin típicamente sale del retorno de alguna función.
    plugins: [vue()],
}