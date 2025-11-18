<template>
  <div class="card" @click="$emit('click')">
      <div class="front" :style="{ backgroundImage: `url(${src})` }" ></div>
      <div class="back">
        <slot name="back" @click="$emit('click')"></slot>
      </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
:root{
  --pixel-font: 'Silkscreen', monospace; /* fuente pixelada*/
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--pixel-font);
  color: #FF0000;
  text-align: center;
}
.card{
  position: relative;
  width: 20vh;
  height: 30vh;
}
.card div {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transition: 1s;
}
.card .front{
  background-color: #07181b;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 0.6vh solid #770000;;
  outline: 0.6vh solid #FF0000;
  outline-offset: 0.6vh; 
  transform: perspective(50vh) rotate(0deg);
}
.card .back{
  background: #3a0000;
  border: 0.6vh solid #770000;
  outline: 0.6vh solid #FF0000;
  outline-offset: 0.6vh; 
  transform: perspective(50vh) rotateY(180deg);
}
.card:hover .front{
  transform: perspective(50vh) rotateY(180deg);
}
.card:hover .back{
  transform: perspective(50vh) rotateY(360deg);
}
</style>
