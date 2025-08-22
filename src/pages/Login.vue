<script>
export default {
    name: 'Login',
}
</script>

<template>
    <h1>Ingresar a mi cuenta</h1>

    <form action="#">
        <div class="mb-3">
            <label for="email" class="mb-2">Email</label>
            <input type="email" id="email" class="form-control">
            <!-- ARIA => Accessible Rich Internet Applications -->
            <!-- <input type="email" id="email" class="form-control" placeholder="Email" aria-label="Email"> -->
        </div>
        <div class="mb-3">
            <label for="password" class="mb-2">Contraseña</label>
            <input type="password" id="password" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Ingresar</button>
    </form>
</template>