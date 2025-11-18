/**
 * Ajustes de audio de la aplicación.
 *
 * - `musicVolume`: volumen de la música (0.0 - 1.0).
 * - `sfxVolume`: volumen de los efectos de sonido (0.0 - 1.0).
 * - `muted`: indicador global de silencio.
 */
export type AudioSettings = {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
};

/** Valores por defecto de los ajustes de audio. */
const settings: AudioSettings = { musicVolume: 0.8, sfxVolume: 0.8, muted: false };

/**
 * Conjunto de listeners que se ejecutan cuando cambian los ajustes.
 * Cada listener recibe una copia del objeto `AudioSettings` actualizado.
 */
const listeners = new Set<(s: AudioSettings) => void>();

/**
 * Carga los ajustes de audio desde localStorage y los aplica sobre el objeto
 * `settings` en memoria. Si no existe nada en localStorage, mantiene los
 * valores por defecto.
 *
 * Efectos secundarios:
 * - Modifica el objeto `settings` en memoria.
 *
 * Uso:
 * loadAudioSettings();
 */
export function loadAudioSettings() {
  const s = localStorage.getItem("audio-settings");
  if (s) Object.assign(settings, JSON.parse(s));
}

/**
 * Devuelve el objeto de ajustes actual.
 *
 * Nota: se devuelve la referencia al objeto interno `settings`. Si necesita una
 * copia defensiva para evitar mutaciones externas, haga `{ ...getAudioSettings() }`.
 */
export function getAudioSettings(): AudioSettings {
  return settings;
}

/**
 * Actualiza parcialmente los ajustes de audio, persiste los cambios en
 * localStorage y notifica a los listeners registrados.
 *
 * Parámetros:
 * - `partial`: objeto parcial con las propiedades a actualizar.
 *
 * Efectos secundarios:
 * - Actualiza `settings` en memoria.
 * - Guarda el JSON en localStorage bajo la clave `audio-settings`.
 * - Llama a cada listener con una copia de los ajustes actualizados.
 *
 * Ejemplo:
 * setAudioSettings({ musicVolume: 0.5 });
 */
export function setAudioSettings(partial: Partial<AudioSettings>) {
  Object.assign(settings, partial);
  localStorage.setItem("audio-settings", JSON.stringify(settings));
  for (const cb of listeners) cb({ ...settings });
}

/**
 * Registra un callback que será notificado cuando cambien los ajustes.
 *
 * Parámetros:
 * - `cb`: función que recibe el objeto `AudioSettings` actualizado.
 *
 * Devuelve una función de desuscripción que elimina el listener cuando se
 * invoca.
 *
 * Ejemplo:
 * const unsubscribe = onAudioSettingsChange(s => console.log('nuevo', s));
 * // más tarde
 * unsubscribe();
 */
export function onAudioSettingsChange(cb: (s: AudioSettings) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
