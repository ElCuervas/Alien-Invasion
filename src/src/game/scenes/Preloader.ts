import { Scene } from 'phaser';

import mainThemeSrc from '@/assets/Audio/arcade-beat-323176.mp3';
import buttonSfxSrc from '@/assets/Audio/Click_UI.mp3';
import shootSfxSrc from '@/assets/Audio/Laser_shoot.mp3';

import playerImg from '@/assets/Sprite/Player/player.png';
import enemy1Img from '@/assets/Sprite/Enemy/enemy_1.png';
import enemy2Img from '@/assets/Sprite/Enemy/enemy_2.png';
import enemy3Img from '@/assets/Sprite/Enemy/enemy_3.png';
import bulletImg from '@/assets/Sprite/Common/bullet.png';

/**
 * Escena de carga inicial del juego.
 *
 * Carga todos los recursos esenciales antes de iniciar la escena principal.
 * Muestra una barra de progreso animada conforme los assets se van cargando.
 */
export class Preloader extends Scene {
  /**
   * Crea una nueva instancia del preloader.
   */
  constructor() {
    super('Preloader');
  }

  /**
   * Inicializa la interfaz visual del preloader.
   * Dibuja el fondo, marco y barra de progreso que se actualizará durante la carga.
   */
  init(): void {
    this.add.image(512, 384, 'background');

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(282, 384, 4, 28, 0xffffff);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  /**
   * Carga todos los recursos del juego:
   * - Música y efectos de sonido.
   * - Imágenes y sprites necesarios para las escenas de juego.
   */
  preload(): void {
    this.load.audio('mainTheme', mainThemeSrc);
    this.load.audio('buttonSFX', buttonSfxSrc);
    this.load.audio('shootSFX', shootSfxSrc);

    this.load.image('player', playerImg);
    this.load.image('enemy_1', enemy1Img);
    this.load.image('enemy_2', enemy2Img);
    this.load.image('enemy_3', enemy3Img);
    this.load.image('bullet', bulletImg);
  }

  /**
   * Se ejecuta una vez que todos los recursos han sido cargados.
   * Inicia la escena principal del juego.
   */
  create(): void {
    this.scene.start('Game');
  }
}
