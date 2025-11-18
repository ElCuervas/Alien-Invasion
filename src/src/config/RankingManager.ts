/**
 * Módulo: RankingManager
 *
 * Versión adaptada para conexión con backend Express.
 * Intenta usar el endpoint http://localhost:3000/api/ranking,
 * y en caso de error, usa localStorage como respaldo.
 */

const KEY = "game-ranking";
const API_URL = "http://localhost:3000/api/ranking";

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

/**
 * Recupera el ranking desde el backend o desde localStorage si el servidor no responde.
 */
export async function getRanking(): Promise<ScoreEntry[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Servidor no disponible");
    const data = (await response.json()) as ScoreEntry[];
    // También actualiza localStorage como respaldo
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn(" Usando ranking local, backend no disponible:", error);
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  }
}

/**
 * Añade una nueva entrada al ranking.
 * Primero intenta enviarla al backend, y si falla, la guarda localmente.
 */
export async function addScore(entry: ScoreEntry): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: entry.name, score: entry.score }),
    });

    if (!response.ok) throw new Error("Error al guardar puntaje en servidor");

    const data = await response.json();
    const top10 = data.top10 || [];
    localStorage.setItem(KEY, JSON.stringify(top10));
  } catch (error) {
    console.warn(" No se pudo conectar al backend, guardando localmente:", error);

    const ranking = getRankingLocal();
    ranking.push(entry);
    ranking.sort((a, b) => b.score - a.score);
    const top10 = ranking.slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify(top10));
  }
}

/** Función auxiliar para leer localStorage directamente */
function getRankingLocal(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}
