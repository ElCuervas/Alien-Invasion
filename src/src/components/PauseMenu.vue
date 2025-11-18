<template>
  <div v-if="visible" class="pause-overlay">
    <div class="pause-box">
      <h1>PAUSA</h1>

      <div class="buttons">
        <button @click="$emit('resume')" class="menu-button">Reanudar</button>
        <button @click="$emit('restart')" class="menu-button">Reiniciar</button>
        <button @click="$emit('home')" class="menu-button">Menú principal</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

defineEmits(['resume', 'restart', 'home']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
:root{
  --pixel-font: 'Silkscreen', monospace; /* fuente pixelada */
}
.pause-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: var(--pixel-font);
  color: #ff0000;
}

/* Caja principal del menú */
.pause-box {
  border: 0.3vh solid #ff0000;
  outline: 0.3vh solid #ff0000;
  outline-offset: 0.6vh;
  background-color: rgba(0, 0, 0, 0.95);
  width: 72vh;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 3vh;
  box-sizing: border-box;
}

/* Título */
.pause-box h1 {
  font-size: 6.4vh;
  margin-top: 0.1vh;
  margin-bottom: 2vh;
  letter-spacing: 0.2vh;
}

/* Botones */
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
}

.menu-button {
  font-family: var(--pixel-font);
  font-size: 2vh;
  color: #ff0000;
  background: black;
  border: 0.2vh solid #ff0000;
  outline: 0.2vh solid #ff0000;
  outline-offset: 0.3vh;
  padding: 1vh 4vh;
  width: 32vh;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s ease;
}

.menu-button:hover {
  color: black;
  background: #ff0000;
  box-shadow: 0 0 0.8vh #ff0000;
}
</style>
