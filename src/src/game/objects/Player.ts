import Phaser from "phaser";
import { BulletP } from "@/game/objects/BulletP";

/**
 * Clase que representa al jugador en el juego.
 * Hereda de Phaser.Physics.Arcade.Sprite y gestiona el movimiento, disparo y estadísticas del jugador.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * Grupo de balas disparadas por el jugador.
     */
    bullets: Phaser.Physics.Arcade.Group | undefined;
    /**
     * Vida actual del jugador.
     */
    health: number = 15;
    /**
     * Vida máxima del jugador.
     */
    health_all: number = 15;
    /**
     * Experiencia actual del jugador.
     */
    exp: number = 0;
    /**
     * Experiencia máxima para subir de nivel.
     */
    exp_all: number = 1000;
    /**
     * Tiempo del último disparo realizado.
     */
    lastShotTime: number = 0;
    /**
     * Cadencia de disparo en milisegundos.
     */
    cadence_bullet: number = 800;
    /**
     * Velocidad de movimiento del jugador.
     */
    speed: number = 250;
    /**
     * Daño que infligen las balas del jugador.
     */
    damage: number = 2;
    /**
     * Configuración de teclas para controlar el jugador.
     */
    wasd: { up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key, Shoot: Phaser.Input.Keyboard.Key } | undefined;
    /**
     * Crea una instancia de Player.
     * @param scene Escena de Phaser donde se añade el jugador.
     * @param x Posición X inicial.
     * @param y Posición Y inicial.
     * @param texture Nombre de la textura del sprite.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'player') {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(true);
        this.setCollideWorldBounds(true);

        //Balas
        this.bullets = scene.physics.add.group({
            classType: BulletP,
            runChildUpdate: true,
            maxSize: 10
        });


        if (this.scene.input && this.scene.input.keyboard) {
            this.wasd = this.scene.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D', Shoot: 'P' }) as any;
        }
    }
    /**
     * Actualiza el estado del jugador en cada frame.
     * Gestiona el movimiento y el disparo.
     * @param delta Tiempo transcurrido desde el último frame.
     */
    update(delta: number) {
        let vx = 0;
        let vy = 0;
        if (this.wasd) {
            if (this.wasd.left.isDown) vx = -this.speed;
            else if (this.wasd.right.isDown) vx = this.speed;
            if (this.wasd.up.isDown) vy = -this.speed;
            else if (this.wasd.down.isDown) vy = this.speed;
        }
        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            body.setVelocity(vx, vy);
        } else {
            const dt = delta / 1000;
            this.x += vx * dt;
            this.y += vy * dt;
        }
        const originY = (this.y as any).originY ?? 0.5;

        //Bordes de Sprite
        const halfUp = this.displayHeight * originY;
        const halfDown = this.displayHeight * (1 - originY);

        //Limitador de la posicion Y del Sprite
        const minY = halfUp + (this.scene.scale.height as number) / 2;
        const maxY = (this.scene.scale.height as number) - halfDown;
        this.y = Phaser.Math.Clamp(this.y, minY, maxY);

        //Disparo con tecla P
        if (this.wasd && Phaser.Input.Keyboard.JustDown(this.wasd.Shoot)) {
            this.ShootBullet();
        }
    }






    /**
     * Dispara una bala si la cadencia lo permite.
     */
    ShootBullet() {
        if (!this.bullets) return;
        const now = this.scene.time.now as number;
        if (now - this.lastShotTime < this.cadence_bullet) return;
        this.lastShotTime = now;
        const bullet = this.bullets.get(this.x, this.y - this.displayHeight, 'bullet') as BulletP | null;
        if (bullet) {
            bullet.fire(this.x, this.y - this.displayHeight / 2, -500);
        }
    }

    /**
     * Establece la velocidad de movimiento del jugador.
     * @param speed Nueva velocidad.
     */
    setSpeed(speed: number) {
        this.speed = speed;
    }

    /**
     * Devuelve el porcentaje de vida actual del jugador.
     * @returns Porcentaje de vida (0-100).
     */
    getPorcentageHealth(): number {
        return (this.health / this.health_all) * 100;
    }

    /**
     * Devuelve el porcentaje de experiencia actual del jugador.
     * @returns Porcentaje de experiencia (0-100).
     */
    expPercentage(): number {
        return (this.exp / this.exp_all) * 100;
    }
}