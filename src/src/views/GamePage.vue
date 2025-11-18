<template>
  <div class="flex-vertical">
    <span>V</span>
    <span>I</span>
    <span>D</span>
    <span>A</span>
  </div>
  <Bar class="bar-health" :value=health></Bar>
  <div id="game-root">
    <div id="game-container"></div>
    <h2 class="game-score">Score: <span class="score-number">{{ score }}</span></h2>
  </div>
  <Bar class="bar-exp" :value=exp></Bar>
  <div class="flex-vertical">
    <span>N</span>
    <span>I</span>
    <span>V</span>
    <span>E</span>
    <span>L</span>
  </div>
  <DeckCards v-if="level > 1" :level="level" class="deck" />
  <!-- Menú de pausa -->
  <PauseMenu
    :visible="paused"
    @resume="resumeGame"
    @restart="restartGame"
    @home="goHome"
  />

</template>



<script setup lang="ts">
/**
 * Vista GamePage
 * Controla la pantalla principal de juego, gestionando el ciclo de vida del juego Phaser,
 * el estado del jugador y la interacción con el menú de pausa.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EventBus } from '../game/EventBus';
import StartGame from '../game/main';
import Bar from '../components/Bar.vue';
import PauseMenu from '../components/PauseMenu.vue';
import router from '../router';
import DeckCards from '@/components/DeckCards.vue';

/** Vida actual del jugador (porcentaje) */
const health = ref(100);
/** Puntaje actual del jugador */
const score = ref(0);
/** Estado de pausa del juego */
const paused = ref(false);

/** Actualiza la vida del jugador */
function updateHealth(newHealth: number) {
  health.value = newHealth;
}

/** Actualiza el puntaje del jugador */
function updateScore(newScore: number) {
  score.value = newScore;
}
/** Experiencia actual del jugador */
const exp = ref(0);
/** Actualiza la experiencia del jugador */
function updateExp(newExp: number) {
  exp.value = newExp;
}

/** Nivel actual del jugador */
const level = ref(1);
/** Actualiza el nivel del jugador */
function updateLevel(newLevel: number) {
  level.value = newLevel;
}
/** Instancia del juego Phaser */
let gameInstance: any;

/**
 * Destruye la instancia actual del juego Phaser.
 */
function destroyGameInstance() {
  try {
    gameInstance?.destroy(true);
  } catch (e) {}
  gameInstance = null;
}

/**
 * Alterna el estado de pausa del juego y emite el evento correspondiente.
 */
function togglePause() {
  paused.value = !paused.value;
  if (gameInstance && gameInstance.scene) {
    if (paused.value) {
      EventBus.emit('game:pause', { paused: true});
    } else {
      EventBus.emit('game:resume', { paused: false });
    }
  }
}

/**
 * Reanuda el juego desde el menú de pausa.
 */
function resumeGame() {
  paused.value = false;
  EventBus.emit('game:resume', { paused: false });
}

/**
 * Reinicia el juego creando una nueva instancia de Phaser.
 */
function restartGame() {
  destroyGameInstance();
  gameInstance = StartGame('game-container');
  paused.value = false;
}

/**
 * Sale al menú principal destruyendo la instancia del juego.
 */
function goHome() {
  destroyGameInstance();
  router.push({ name: 'Home' });
}

/**
 * Ciclo de vida: al montar, inicializa el juego y listeners de eventos.
 */
onMounted(() => {
  // Listeners de eventos del juego
  EventBus.on('player:health', updateHealth);
  EventBus.on('player:score', updateScore);
  EventBus.on('player:exp', updateExp);
  EventBus.on('player:levelup', updateLevel);

  EventBus.on('game:over', (finalScore: number) => {
    destroyGameInstance();
    router.push({ name: 'GameOver', query: { score: String(finalScore) } });
  });
  EventBus.on('game:finished', () => {
    destroyGameInstance();
  });

  // Inicia el juego
  gameInstance = StartGame('game-container');

  // Escucha tecla ESC para pausar
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') togglePause();
  });
});

/**
 * Ciclo de vida: al desmontar, elimina listeners y destruye el juego.
 */
onBeforeUnmount(() => {
  EventBus.off('player:health', updateHealth);
  EventBus.off('player:score', updateScore);
  EventBus.off('player:exp', updateExp);
  EventBus.off('player:levelup', updateLevel);
  EventBus.off('game:over');
  EventBus.off('game:finished');
  if (gameInstance?.destroy) gameInstance.destroy(true);
  gameInstance = null;
});
</script>

<style scoped>
.bar-health {
  top: 2vh;
}
.bar-exp {
  top: 2vh;
}

#game-root {
  position: relative;
}

.game-score {
  position: absolute;
  right: 0vh;
  top: 10vh;
  color: #FF0000;
  font-size: 2vh;
  margin: 0;
  white-space: nowrap;
}

.score-number {
  display: inline-block;
  min-width: 3ch; 
  text-align: right; 
  font-family: var(--pixel-font);
}
.deck {
  position: absolute;
  justify-content: center;
  align-items: center;
}
.flex-vertical {
  top: 2vh;
  font-size: 4vh;
  color: #FF0000;
  display: flex;
  flex-direction: column;
  
}
.flex-vertical span {
  line-height: 1;
  margin-bottom: 4vh;
}

</style>
