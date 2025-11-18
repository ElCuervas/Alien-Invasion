<template>
  <div class="ranking-container">
    <h1>Ranking</h1>

    <table v-if="scores.length > 0" class="ranking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Jugador</th>
          <th>Puntaje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in scores" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.player }}</td>
          <td>{{ item.score }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay puntajes registrados.</p>

    <GameButton @click="goHome" class="menu-button">Volver</GameButton>
  </div>
</template>

<script setup lang="ts">
/**
 * Vista RankingPage
 * Muestra la tabla de puntajes obtenidos por los jugadores, obtenidos desde el backend.
 * Permite volver al menú principal.
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import GameButton from "../components/GameButton.vue";

/** Estructura de cada entrada de ranking */
interface ScoreEntry {
  player: string;
  score: number;
  date: string;
}

/** Instancia del router para navegación */
const router = useRouter();
/** Lista reactiva de puntajes */
  const scores = ref<ScoreEntry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

/**
 * Obtiene el ranking de puntajes desde el servidor backend.
 * @returns Array de ScoreEntry
 */
async function fetchRankingFromServer(): Promise<ScoreEntry[]> {
  const api = (window as any).gameApi;
  try {
    loading.value = true;
    error.value = null;
    if (api && typeof api.getLeaderboard === 'function') {
      const data = await api.getLeaderboard();
      return data.map((it: any) => ({
        player: it.username ?? 'Anon',
        score: it.score ?? 0,
      } as ScoreEntry));
    }
    // localStorage como respaldo.
    console.warn('gameApi no disponible: usando ranking local');
    const raw = localStorage.getItem('game-ranking');
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch (err: any) {
    console.error('Error al leer ranking del servidor:', err);
    error.value = err?.message || String(err);
    return [];
  } finally {
    loading.value = false;
  }
}

/**
 * Al montar, carga el ranking desde el servidor.
 */
onMounted(async () => {
  scores.value = await fetchRankingFromServer();
});

/**
 * Navega al menú principal.
 */
function goHome() {
  router.push({ name: "Home" });
}
</script>

<style scoped>
.ranking-container {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 80vh;
  color: #FF0000;
  border: 0.2vh solid #FF0000;
  outline: 0.2vh solid #FF0000;
  outline-offset: 0.4vh;
  font-size: 2.2vh;
  gap: 1.6vh;
  margin: 4vh auto;
  padding: 3.2vh 1.6vh 2.4vh 1.6vh;
  box-sizing: border-box;
  background: rgba(0,0,0,0.85);
  text-align: center;
}

.ranking-container h1 {
  font-size: 4.8vh;
  margin-bottom: 1.8vh;
  letter-spacing: 0.2vh;
}

.ranking-table {
  border-collapse: collapse;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 1.6vh auto;
  color: #FF0000;
  background-color: #000;
  font-size: 1.8vh;
  box-shadow: 0 0.2vh 1.6vh rgba(0,0,0,0.3);
}

.ranking-table th,
.ranking-table td {
  border: 0.1vh solid #FF0000;
  padding: 1vh 0.8vh;
  text-align: center;
}

.ranking-table th {
  background-color: #200000;
  font-weight: bold;
  font-size: 2vh;
}

.ranking-table tbody tr:nth-child(even) {
  background-color: #1a0000;
}

.menu-button {
  font-size: 2.2vh;
  margin-top: 2.4vh;
  padding: 0.8vh 3.2vh;
}
</style>
