<template>
  <div class="options-box">
    <h1>Opciones</h1>

    <div class="option-row">
      <span>Música</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model.number="musicVolume"
        @input="updateSettings"
      />
    </div>

    <div class="option-row">
      <span>Efectos de sonido</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model.number="sfxVolume"
        @input="updateSettings"
      />
    </div>
    <div class="buttons">
      <GameButton class="config-button">Configurar teclado</GameButton>
      <GameButton @click="MainMenu" class="exit-button">Salir</GameButton>
    </div>
  </div>

</template>

<script setup lang="ts">
/**
 * Vista OptionsPage
 * Permite al usuario modificar las opciones de audio (música y efectos de sonido)
 * y navegar de regreso al menú principal.
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameButton from '../components/GameButton.vue';
import { getAudioSettings, setAudioSettings } from '@/config/AudioSettings';

/** Instancia del router para navegación */
const router = useRouter();

/** Volumen de la música (0.0 a 1.0) */
const musicVolume = ref(0.5);
/** Volumen de los efectos de sonido (0.0 a 1.0) */
const sfxVolume = ref(0.5);

/**
 * Al montar, carga los valores actuales de configuración de audio.
 */
onMounted(() => {
  const settings = getAudioSettings();
  musicVolume.value = settings.musicVolume;
  sfxVolume.value = settings.sfxVolume;
});

/**
 * Actualiza la configuración global de audio con los valores actuales.
 */
function updateSettings() {
  setAudioSettings({
    musicVolume: musicVolume.value,
    sfxVolume: sfxVolume.value,
  });
}

/**
 * Navega al menú principal.
 */
function MainMenu() {
  router.push({ name: 'Home' });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.options-box {
  border: 0.3vh solid #ff0000;
  outline: 0.3vh solid #ff0000;
  outline-offset: 0.6vh;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100vh;
  height: auto;
  color: #ff0000;
  text-align: center;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  margin-top: -3vh; 
}

.options-box h1 {
  font-size: 6.4vh;
  margin-bottom: 4vh;
  text-transform: capitalize;
}

.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 2vh 0;
  font-size: 2.8vh;
}

.option-row span {
  flex: 1;
  text-align: left;
}

input[type='range'] {
  flex: 1;
  appearance: none;
  height: 0.4vh;
  background: #ff0000;
  border-radius: 0.3vh;
  cursor: pointer;
}

input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 1.2vh;
  height: 1.2vh;
  background: #ff0000;
  border-radius: 50%;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh; 
  gap: 2.4vh;
}

.config-button,
.exit-button {
  font-size: 2.6vh;
  padding: 1vh 4vh;
  width: 32vh;
}

.exit-button {
  margin-bottom: 4vh;
}
</style>


