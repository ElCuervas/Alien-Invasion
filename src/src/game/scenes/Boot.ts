import { Scene } from 'phaser';
import { getAudioSettings, onAudioSettingsChange } from '@/config/AudioSettings';
import backgroundImg from '@/assets/Image/map.png';

/**
 * Escena inicial (Boot) del juego.
 *
 * Tareas:
 * - Cargar los recursos mínimos necesarios para mostrar la pantalla de carga.
 * - Inicializar valores globales en el registro de Phaser (ej. volúmenes).
 * - Mantener sincronización con los cambios de audio en tiempo real.
 * - Lanzar la escena `Preloader`.
 */
export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  /**
   * Precarga de recursos mínimos necesarios antes del preloader.
   * Carga aquí imágenes o assets imprescindibles para la pantalla de carga.
   */
  preload() {
    this.load.image('background', backgroundImg);
  }

  /**
   * Inicializa el estado global del audio (música y efectos)
   * y transiciona a la escena `Preloader`.
   */
  create() {
    // Obtiene la configuración actual desde localStorage
    const { musicVolume, sfxVolume } = getAudioSettings();

    // Guarda los valores iniciales en el registro global de Phaser
    this.registry.set('musicVolume', musicVolume);
    this.registry.set('sfxVolume', sfxVolume);

    // Escucha cambios de volumen en tiempo real y actualiza el registro
    onAudioSettingsChange((settings) => {
      this.registry.set('musicVolume', settings.musicVolume);
      this.registry.set('sfxVolume', settings.sfxVolume);
    });

    // Cambia a la escena principal de carga
    this.scene.start('Preloader');
  }
}
