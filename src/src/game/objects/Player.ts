import Phaser from "phaser";
import { BulletP } from "@/game/objects/BulletP";
import { getControlConfig } from "@/config/ControlSettings";
import { getAudioSettings } from "@/config/AudioSettings";

/**
 * Representa al jugador principal dentro del juego.
 *
 * Gestiona movimiento, disparos, experiencia, vida y controles personalizados.
 * También se encarga de reproducir efectos de sonido al disparar.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    bullets: Phaser.Physics.Arcade.Group | undefined;

    health: number = 15;
    health_all: number = 15;

    exp: number = 0;
    exp_all: number = 1000;

    lastShotTime: number = 0;
    cadence_bullet: number = 800;

    speed: number = 250;
    damage: number = 2;

    keys:
        | {
              up: Phaser.Input.Keyboard.Key;
              down: Phaser.Input.Keyboard.Key;
              left: Phaser.Input.Keyboard.Key;
              right: Phaser.Input.Keyboard.Key;
              shoot: Phaser.Input.Keyboard.Key;
          }
        | undefined;

    /**
     * Crea una nueva instancia del jugador.
     *
     * @param scene Escena de Phaser donde se crea el jugador.
     * @param x Posición inicial en el eje X.
     * @param y Posición inicial en el eje Y.
     * @param texture Nombre de la textura asignada al sprite.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = "player") {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setCollideWorldBounds(true);

        this.bullets = scene.physics.add.group({
            classType: BulletP,
            runChildUpdate: true,
            maxSize: 10,
        });

        const cfg = getControlConfig();

        if (scene.input && scene.input.keyboard) {
            this.keys = scene.input.keyboard.addKeys({
                up: cfg.moveUp,
                down: cfg.moveDown,
                left: cfg.moveLeft,
                right: cfg.moveRight,
                shoot: cfg.shoot
            }) as any;
        }
    }

    /**
     * Actualiza el estado del jugador en cada frame.
     *
     * Maneja movimiento, límites verticales y detección de disparo.
     *
     * @param delta Tiempo transcurrido desde el último frame.
     */
    update(delta: number) {
        let vx = 0;
        let vy = 0;

        if (this.keys) {
            if (this.keys.left.isDown) vx = -this.speed;
            else if (this.keys.right.isDown) vx = this.speed;

            if (this.keys.up.isDown) vy = -this.speed;
            else if (this.keys.down.isDown) vy = this.speed;
        }

        const body = this.body as Phaser.Physics.Arcade.Body | null;

        if (body) {
            body.setVelocity(vx, vy);
        } else {
            const dt = delta / 1000;
            this.x += vx * dt;
            this.y += vy * dt;
        }

        const originY = (this as any).originY ?? 0.5;
        const halfUp = this.displayHeight * originY;
        const halfDown = this.displayHeight * (1 - originY);

        const minY = halfUp + this.scene.scale.height / 2;
        const maxY = this.scene.scale.height - halfDown;

        this.y = Phaser.Math.Clamp(this.y, minY, maxY);

        if (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            this.ShootBullet();
        }
    }

    /**
     * Ejecuta un disparo del jugador.
     *
     * Controla cadencia de tiro, genera una bala y reproduce sonido.
     */
    ShootBullet() {
        if (!this.bullets) return;

        const now = this.scene.time.now;
        if (now - this.lastShotTime < this.cadence_bullet) return;

        this.lastShotTime = now;

        const bullet = this.bullets.get(
            this.x,
            this.y - this.displayHeight,
            "bullet"
        ) as BulletP | null;

        if (bullet) {
            bullet.fire(this.x, this.y - this.displayHeight / 2, -500);
        }

        const { sfxVolume, muted } = getAudioSettings();
        this.scene.sound.play("shootSFX", {
            volume: muted ? 0 : sfxVolume
        });
    }

    /**
     * Modifica la velocidad de movimiento del jugador.
     *
     * @param speed Nueva velocidad.
     */
    setSpeed(speed: number) {
        this.speed = speed;
    }

    /**
     * Devuelve el porcentaje actual de vida.
     *
     * @returns Número entre 0 y 100.
     */
    getPorcentageHealth(): number {
        return (this.health / this.health_all) * 100;
    }

    /**
     * Devuelve el porcentaje actual de experiencia.
     *
     * @returns Número entre 0 y 100.
     */
    expPercentage(): number {
        return (this.exp / this.exp_all) * 100;
    }
}
