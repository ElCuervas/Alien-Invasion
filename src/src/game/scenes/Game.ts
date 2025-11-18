import { GameObjects, Scene } from 'phaser';
import { Player } from '@/game/objects/Player';
import { Enemy } from '@/game/objects/Enemy';
import { EventBus } from '@/game/EventBus';
import { Upgrade } from '@/game/objects/Upgrade';

/**
 * Scene principal del juego donde se instancia el jugador, el enemigo,
 * se gestiona la música y las colisiones, y se controla la finalización
 * de la partida.
 *
 * Responsabilidades principales:
 * - Crear y posicionar objetos de juego (fondo, jugador, enemigo).
 * - Manejar la reproducción de la música principal.
 * - Detectar colisiones y actualizar vidas / puntaje.
 * - Finalizar la partida y navegar a la pantalla de Game Over.
 */
export class Game extends Scene {
  /** Imagen de fondo del nivel. */
  background: GameObjects.Image;

  /** Instancia del jugador. */
  player: Player;

  /** Instancia del enemigo actual. */
  enemies: Enemy[] = [];

  /** Puntuación acumulada en la partida. */
  Score: number = 0;

  /** Instancia de las mejoras del jugador. */
  upgrade: Upgrade;

  /* Tipo de enemigo actual */
  type_enemy: number = 1;
  /** Contador de enemigos eliminados */
  count_enemy: number = 0;
  count_enemy2: number = 0;
  count_enemy3: number = 0;


  /** Referencia a la música principal del juego. */
  private music: Phaser.Sound.BaseSound | null = null;

  /** Handlers registrados en EventBus (para poder desregistrarlos en shutdown). */
  private handleGamePause!: (payload: { paused: boolean }) => void;
  private handleGameResume!: (payload: { paused: boolean }) => void;

  constructor() {
    super('Game');
  }

  /**
   * Inicializa y configura los objetos del escenario, la música y las
   * colisiones. Esta función es llamada por Phaser cuando la escena arranca.
   */
  create(): void {
    // Fondo
    this.background = this.add.image(897 / 2, 1014 / 2, 'background').setDepth(0);

    // Jugador
    this.player = new Player(this, 100, 100, 'player');
    this.player.setPosition(this.scale.width / 2, this.scale.height - 100);

    // Enemigo-1
    const centerX = this.scale.width / 2;
    let startY = 0;
    // Patrones de movimiento para los enemigos básicos
    const patterns: Array<{ pattern: string; params?: any }> = [
      { pattern: 'horizontal' },
      { pattern: 'sine', params: { amp: 60, freq: 0.5, cx: centerX + 200 } },
      { pattern: 'sine', params: { amp: 60, freq: 0.5, cx: centerX}  },
      { pattern: 'sine', params: { amp: 60, freq: 0.5, cx: centerX - 200 } },
      { pattern: 'horizontal' },
    ];

    // Crea múltiples enemigo basicos con diferentes patrones
    this.enemies = patterns.map((p, i) => {
      const x = centerX + (i - 2) * 150;
      // Determina la posición Y de inicio para el enemigo
      if (i === 0) {
        startY = 50;
      } else if (i === 4) {
        startY = 300;
      } else {
        startY = 200;
      }
      const e = new Enemy(this, x, startY, 'enemy_1', p.pattern, p.params);
      if (i === 0 || i === 4) {
        e.setCollideWorldBounds(true);
      }
      return e;
    });

    // Instancia de música
    this.playGameMusic();


    // Instancia de Upgrade
    this.upgrade = new Upgrade(this, 0, 0, '', this.player);

    // Listener para selección de carta de mejora
    EventBus.on('deck:card:selected', this.onDeckCardSelected, this)
    // Registrar handlers nombrados para poder removerlos cuando la escena se cierre.
    this.handleGamePause = (_payload: { paused: boolean }) => {
      try {
        if ((this.scene as any)?.manager) this.scene.pause();
      } catch (e) {
        // Silenciar errores si la escena ya no tiene manager
      }
    };
    this.handleGameResume = (_payload: { paused: boolean }) => {
      try {
        if ((this.scene as any)?.manager) this.scene.resume();
      } catch (e) {
        // Silenciar errores si la escena ya no tiene manager
      }
    };

    EventBus.on('game:pause', this.handleGamePause, this);
    EventBus.on('game:resume', this.handleGameResume, this);
  }

  // Maneja la selección de una carta de mejora desde el DeckCards.vue
  onDeckCardSelected(payload: { option?: number }) {
    const option = payload?.option;
    if (typeof option === 'number') {
      this.upgrade.upgrade_exp(option);
    }
  }

  /**
   * Reproduce la música principal del juego si no está ya en reproducción.
   * Lee el volumen del registro (valor por defecto 0.5 si no está presente).
   */
  playGameMusic(): void {
    if (this.music && this.music.isPlaying) return;
    const musicVolume = (this.registry.get('musicVolume') as number) ?? 0.5;
    this.music = this.sound.add('mainTheme', {
      loop: true,
      volume: musicVolume,
    });

    this.music.play();
    this.registry.set('audioMainTheme', this.music);

  }
  /**
   * Actualización por frame. Se delega la lógica de actualización a
   * los objetos Player y Enemy. Además, gestiona las colisiones
   * y finaliza el juego si el jugador muere.
   *
   * @param _time - tiempo actual (ms)
   * @param delta - tiempo transcurrido desde el último frame (ms)
   */
  update(_time: number, delta: number): void {
  this.player.update(delta);
  for (const e of this.enemies) e.update(delta);
    EventBus.emit('player:health', this.player.getPorcentageHealth());
    EventBus.emit('player:score', this.Score);
    EventBus.emit('player:exp', this.player.expPercentage());

    // Colisión: balas del enemigo → jugador
    for (const en of this.enemies) {
      if (en.bullets) {
        this.physics.add.overlap(this.player, en.bullets, (_player, bullet) => {
          bullet.destroy();
          this.player.health -= 1;
          if (this.player.health <= 0) {
            EventBus.emit('game:finished', true);
            EventBus.emit('game:over', this.Score || 0);
          }
        });
      }
    }
    // Colisión: balas del jugador → enemigo
    if (this.player.bullets) {
      this.enemies.forEach((en, idx) => {
        this.physics.add.overlap(en, this.player.bullets as any, (enemyObj, bullet) => {
          bullet.destroy();

          const enemy = enemyObj as Enemy;
          enemy.hearts -= this.player.damage;

          if (enemy.hearts <= 0) {
            enemy.destroy();
            this.Score += 100;
            this.player.exp += 100;
            let startY = 0;
            // Determina la posición Y de inicio para el nuevo enemigo
            if (idx === 0) {
              startY = 50;
            } else if (idx === 4) {
              startY = 300;
            } else {
              startY = 200;
            }
            switch (this.type_enemy) {
              case 1:{// Reemplaza el enemigo basico destruido por uno nuevo con patrón aleatorio
                this.createEnemies( enemy, idx, startY, 'enemy_1' );
                this.propertiesEnemies(idx, 2, 0);
                this.count_enemy++;

                if (this.enemies[idx].texture.key === 'enemy_1'){
                  this.enemies[0].pattern = 'horizontal';
                  this.enemies[1].pattern = 'sine';
                  this.enemies[3].pattern = 'sine';
                  this.enemies[4].pattern = 'horizontal';
                }

                if (this.count_enemy == 10){
                  this.type_enemy = 2;
                  this.count_enemy = 0;
                }
                break;
              }
              case 2:{  // Reemplaza el enemigo ligero destruido por uno nuevo
                this.createEnemies( enemy, idx, startY, 'enemy_2' );
                if (idx === 0 || idx === 2 || idx === 4) {
                  this.enemies[idx].pattern = 'static';
                  this.enemies[idx].setTexture('enemy_1');
                } else if (idx === 1 || idx === 3) {
                  this.propertiesEnemies(idx, 4, 1);
                  this.count_enemy2++;
                }
                if (this.count_enemy2 === 4){
                  this.type_enemy = 3;
                  this.count_enemy2 = 0;
                }
                break;
              }
              case 3: { // Reemplaza el enemigo pesado destruido por uno nuevo
                this.createEnemies( enemy, idx, startY, 'enemy_3' );
                if (idx === 2) {
                  this.propertiesEnemies(idx, 6, 2);
                  this.count_enemy3++;
                } else{
                  this.enemies[idx].pattern = 'static';
                  this.enemies[idx].setTexture('enemy_1'); 
                  if (this.enemies[1].pattern === 'static' && this.enemies[3].pattern === 'static'){
                    this.enemies[2].pattern = 'sine';
                  }   
                }
                if (this.count_enemy3 === 2){
                  this.type_enemy = 1;
                  this.count_enemy3 = 0;
                }
                break;
              }
            }
          } 
        });
      });
    }
    // Nivel Up de player, diente la escena para que el jugador pueda elegir la mejora
    if (this.player.exp >= this.player.exp_all) {
      this.scene.pause();
      EventBus.emit('player:levelup', 2);
    }
  }

  // Limpieza de listeners al finalizar la escena
  shutdown(): void {
    EventBus.off('deck:card:selected', this.onDeckCardSelected, this);
    EventBus.off('game:pause', this.handleGamePause, this);
    EventBus.off('game:resume', this.handleGameResume, this);
  }

  /**
   * Crea un enemigo con los parámetros especificados y lo añade al array de enemigos.
   * @param enemy - Objeto enemigo con configuración de patrón y parámetros.
   * @param idx - Índice en el array de enemigos donde se almacenará.
   * @param startY - Posición Y inicial del enemigo.
   * @param texture - Textura a usar para el enemigo.
   */
  createEnemies( enemy: Enemy, idx: number, startY: number, texture: string ){
    const p = (enemy as any).pattern;
    const params = (enemy as any).patternParams;
    const x = enemy.x || (this.scale.width / 2);
    const newEnemy = new Enemy(this, x, startY, texture, p, params);
    this.enemies[idx] = newEnemy;
  }
  /**
   * Configura las propiedades de un enemigo específico en el array.
   * @param idx - Índice del enemigo en el array.
   * @param hearts - Número de vidas del enemigo.
   * @param select_bullet - Tipo de bala que disparará el enemigo.
   */
  propertiesEnemies(idx : number, hearts: number, select_bullet: number){
    this.enemies[idx].hearts = hearts;
    this.enemies[idx].select_bullet = select_bullet;
    this.enemies[idx].speed = 200;
  }
}
