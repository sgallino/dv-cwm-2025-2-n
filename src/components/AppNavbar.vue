<script>
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <!-- 
    # Formatos de los nombres de clases de Tailwind
    1. <estilo>-<valor> 
        Por ejemplo:
        .p-4                                padding: 1rem;
        .bg-slate-200                       background-color: #e2e8f0;
        .text-center                        text-align: center;
    Esto abarca la mayoría de las clases de Tailwind.

    2. <valor>
        Para estilos cuyos valores son únicos entre los estilos de CSS, o
        para estilos que llevan múltiples valores de una sola vez, Tailwind
        utiliza clases que solo son el nombre del estilo o valor.
        Por ejemplo:
            .flex                           display: flex;
            .grid                           display: grid;
            .underline                      text-decoration: underline;
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-200">
        <RouterLink class="text-xl" to="/">DV Social</RouterLink>
        <ul class="flex gap-4">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/chat">Chat general</RouterLink>
            </li>
            <li>
                <RouterLink to="/ingresar">Ingresar</RouterLink>
            </li>
            <li>
                <RouterLink to="/crear-cuenta">Crear cuenta</RouterLink>
            </li>
        </ul>
    </nav>
</template>