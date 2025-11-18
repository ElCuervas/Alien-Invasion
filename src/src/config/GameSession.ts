// src/config/GameSession.ts
/** URL del endpoint que acepta sesiones de juego en el backend. */
const API_URL = "http://localhost:3000/v1/account/game-session";

/**
 * Representa los datos enviados al servidor para registrar una sesión de juego.
 *
 * Campos:
 * - `playerId`: identificador único del jugador (string).
 * - `score`: puntuación obtenida en la sesión (number).
 * - `playTime`: duración de la sesión en segundos (number).
 * - `date` (opcional): fecha/hora en formato ISO cuando ocurrió la sesión.
 */
export interface GameSession {
  playerId: string;
  score: number;
  playTime: number;
  date?: string;
}

/**
 * Envía una `GameSession` al backend.
 *
 * Realiza una petición POST con contenido JSON al endpoint configurado en
 * `API_URL`. Si la respuesta no es satisfactoria (status >= 400), lanza un
 * `Error` que describe el fallo.
 *
 * @param session - Objeto con los datos de la sesión a enviar.
 * @returns Promise<void> resuelta cuando la petición es exitosa.
 * @throws Error si la respuesta HTTP no es OK.
 *
 * @example
 * await sendGameSession({ playerId: 'user123', score: 1500, playTime: 320 });
 */
export async function sendGameSession(session: GameSession): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    // Propagar un mensaje para que sea más claro en el frontend
    throw new Error("Error al registrar la sesión de juego");
  }

  console.log("Sesión enviada correctamente");
}
