<template>
  <button class="game-button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
:root{
  --pixel-font: 'Silkscreen', monospace; 
}
.game-button {
  background-color: #000;
  border: 0.6vh solid #FF0000;
  outline: 0.6vh solid #FF0000;
  outline-offset: 0.6vh; 
  color: #FF0000;
  padding: 1vh 2vh;
  font-family: var(--pixel-font);
  font-size: 2.4vh;
  margin: 3vh;
  cursor: pointer;
}
</style>
