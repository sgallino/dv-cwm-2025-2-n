<script>
export default {
    name: 'Register',
}
</script>

<template>
    <h1>Crear una nueva cuenta</h1>

    <form action="#">
        <div class="mb-3">
            <label for="email" class="mb-2">Email</label>
            <input type="email" id="email" class="form-control">
        </div>
        <div class="mb-3">
            <label for="password" class="mb-2">Contraseña</label>
            <input type="password" id="password" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Crear mi cuenta</button>
    </form>
</template>