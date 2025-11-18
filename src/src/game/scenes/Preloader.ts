import { Scene } from 'phaser';
import mainTheme from '@/assets/Audio/arcade-beat-323176.mp3';
import playerImg from '@/assets/Sprite/Player/player.png';
import enemy1Img from '@/assets/Sprite/Enemy/enemy_1.png';
import enemy2Img from '@/assets/Sprite/Enemy/enemy_2.png';
import enemy3Img from '@/assets/Sprite/Enemy/enemy_3.png';
import bulletImg from '@/assets/Sprite/Common/bullet.png';


/**
 * Escena de pre-carga de recursos.
 *
 * Tareas principales:
 * - Mostrar una barra de progreso mientras se cargan los assets.
 * - Definir la ruta base de los assets y encolar archivos a cargar.
 * - Transicionar a la escena `Game` cuando la carga finalice.
 */
export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  /**
   * Inicializa elementos visuales mínimos para la pantalla de carga
   * y actualiza la barra de progreso en cada evento de carga.
   */
  init(): void {
    // La imagen de fondo ya fue cargada por la escena Boot
    this.add.image(512, 384, 'background');

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  /**
   * Encola los recursos del juego (audio, sprites, etc.).
   * Se usa `setPath` para mantener rutas relativas más limpias.
   */
  preload(): void {
    this.load.audio('mainTheme', mainTheme);
    this.load.image('player', playerImg);
    this.load.image('enemy_1', enemy1Img);
    this.load.image('enemy_2', enemy2Img);
    this.load.image('enemy_3', enemy3Img);
    this.load.image('bullet', bulletImg);
  }

  /**
   * Una vez completada la carga, se inicia la escena principal del juego.
   */
  create(): void {
    this.scene.start('Game');
  }
}

