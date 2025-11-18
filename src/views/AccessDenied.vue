<template>
  <div class="access-denied">
        <h1>Acceso Denegado</h1>
        <p>Tu sesión no es válida</p>
        <p>Posiblemente no tienes el juego comprado si no es asi</p>
        <p>por favor, vuelve a la plataforma y lanza el juego nuevamente.</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.access-denied{
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #d40000;
}
.access-denied h1{
    text-shadow: 0 0 1vh #520000, 0 0 2vh #850000, 0 0 3vh #ff0000;
}
.access-denied p{
    font-size: 2.5vh;
}
</style>
