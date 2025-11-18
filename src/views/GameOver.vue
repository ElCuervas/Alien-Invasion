<template>
  <div class="game-over">
    <h1>Game Over</h1>
    <p>¡Has perdido! Gracias por jugar.</p>
    <p v-if="score !== null">Tu puntuación: {{ score }}</p>
    <div class="actions">
      <GameButton @click="restartGame" class="menu-button">Reiniciar</GameButton>
      <GameButton @click="saveAndReturn" class="menu-button">Guardar y Volver</GameButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Vista GameOver
 * Muestra la pantalla de fin de partida, permite reiniciar el juego o guardar el puntaje.
 * Gestiona el puntaje, tiempo de juego y el envío al backend.
 */
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import GameButton from "../components/GameButton.vue";
/** Instancia de la ruta actual */
const route = useRoute();
/** Instancia del router para navegación */
const router = useRouter();
/** Puntaje final obtenido por el jugador */
const score = ref<number | null>(null);
/** Tiempo total jugado en segundos */
const playTime = ref<number>(0);
/** Nombre del jugador (si no está autenticado) */
const playerName = ref<string>("");
/** Usuario autenticado actual */
const currentUser = ref<string | null>(null);

/** Bandera para evitar múltiples envíos simultáneos */
let saving = false;

/**
 * Hook de montaje: carga puntaje y tiempo desde la query.
 */
onMounted(async () => {
  // Leer score y tiempo desde la query
  const rawScore = route.query.score;
  const rawTime = route.query.time;

  if (rawScore) {
    const str = Array.isArray(rawScore) ? rawScore[0] : (rawScore as string);
    const n = parseInt(str || "0", 10);
    if (!Number.isNaN(n)) score.value = n;
  }

  if (rawTime) {
    const t = Array.isArray(rawTime) ? rawTime[0] : (rawTime as string);
    const sec = parseInt(t || "0", 10);
    if (!Number.isNaN(sec)) playTime.value = sec;
  }
});

/**
 * Guarda el puntaje y la sesión en el backend y retorna al menú principal.
 * @returns {Promise<void>}
 */
async function saveAndReturn(): Promise<void> {
  if (saving) return;
  saving = true;

  const name = currentUser.value || playerName.value.trim() || "Jugador";

  const api = (window as any).gameApi;

  // Enviar sesión usando la API integrada si está disponible
  if (api && typeof api.updateSession === 'function' && score.value !== null) {
    try {
      await api.updateSession({
        gameSessionDurationSeconds: playTime.value,
        scoreAchieved: score.value,
      });
      console.log('Sesión enviada vía GamePlatformAPI');
    } catch (err) {
      console.warn('Fallo al enviar sesión vía GamePlatformAPI:', err);
    }
  } else {
    console.warn('No hay GamePlatformAPI disponible; puntaje no enviado al servidor. Se usará respaldo local.');
    // Guardar localmente para mostrar en ranking local
    try {
      const raw = localStorage.getItem('game-ranking');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ player: name, score: score.value });
      arr.sort((a: any, b: any) => b.score - a.score);
      localStorage.setItem('game-ranking', JSON.stringify(arr.slice(0, 10)));
    } catch (e) {
      console.error('No se pudo guardar el puntaje localmente:', e);
    }
  }

  router.push({ name: 'Home' });
  saving = false;
}

/**
 * Reinicia el juego y navega a la pantalla principal de juego.
 */
function restartGame(): void {
  router.push({ name: 'Game' });
}
</script>

<style scoped>
.game-over {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 70%;
  color: #ff0000;
  font-size: 3.2vh;
  gap: 1vh;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1vh;
  margin-top: 0.1vh;
}

input {
  font-size: 2vh;
  padding: 0.6vh;
  border: 2px solid red;
  border-radius: 6px;
  background: transparent;
  color: red;
  text-align: center;
}

.menu-button {
  font-size: 2.4vh;
}
</style>
