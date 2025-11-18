<template>
  <div class="menu">
    <h1>Alien Invasion</h1>
    <GameButton @click="goToGame" class="play-button">Jugar</GameButton>
    <div class="layout-row">
      <GameButton @click="goToRanking" class="ranking-button">Ranking</GameButton>
      <GameButton @click="goToOptions" class="options-button">Opciones</GameButton>
    </div>
    <div>
      <img src="../assets/Image/nave_bg.png" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Vista: MainMenu
 *
 * Muestra las acciones principales del juego y reproduce música
 * de fondo según la configuración global en `AudioSettings.ts`.
 */
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import GameButton from '../components/GameButton.vue';
import { getAudioSettings, onAudioSettingsChange } from '@/config/AudioSettings';
import Phaser from 'phaser';

const router = useRouter();

/** Instancia de la música del menú. */
let menuMusic: Phaser.Sound.BaseSound | null = null;

/** Suscriptor para cambios en el volumen */
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  const phaserGame = (window as any).phaserGame as Phaser.Game | undefined;
  if (!phaserGame) return;

  const scene =
    phaserGame.scene.getScene('Boot') || phaserGame.scene.getScene('Game');
  const soundManager = scene?.sound ?? phaserGame.sound;
  if (!soundManager) return;

  const { musicVolume } = getAudioSettings();

  const existing = phaserGame.registry?.get('menuMusic') as Phaser.Sound.BaseSound;
  if (existing && existing.isPlaying) {
    menuMusic = existing;
  } else {
    menuMusic = soundManager.add('mainTheme', { loop: true, volume: musicVolume });
    menuMusic.play();
    phaserGame.registry?.set('menuMusic', menuMusic);
  }

  // 🔊 Escucha cambios en tiempo real del volumen
  unsubscribe = onAudioSettingsChange((settings) => {
    if (menuMusic) {
      (menuMusic as Phaser.Sound.WebAudioSound).setVolume(settings.musicVolume);
    }
  });
});

onUnmounted(() => {
  // Detiene música si sigue sonando
  if (menuMusic && menuMusic.isPlaying) {
    menuMusic.stop();
  }

  // Limpia listener de audioSettings
  if (unsubscribe) {
    unsubscribe();
  }
});

/** Navegación a la escena de juego. */
function goToGame(): void {
  router.push({ name: 'Game' });
}

/** Navegación a opciones. */
function goToOptions(): void {
  router.push({ name: 'Options' });
}

/** Navegación a ranking. */
function goToRanking(): void {
  router.push({ name: 'Ranking' });
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: -20vh;
}
.play-button{
  margin-top: 8vh;
  font-size: 8vh;
}
.options-button,
.ranking-button {
  font-size: 5vh;
}
.layout-row {
  display: flex;
  gap: 5vh;
  margin-top: 4vh;
  gap: 60vh;
}
h1 {
  font-size: 12vh;
  color: #FF0000;
  text-shadow: 0 0 1vh #520000, 0 0 2vh #850000, 0 0 3vh #ff0000;
}
img {
  position: absolute;
  top: 30vh;
  right: 5vh;
  width: 40vh;
}
</style>
