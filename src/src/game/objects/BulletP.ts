import Phaser from "phaser";

/**
 * Bala del jugador (Player Bullet) usada en las escenas del juego.
 *
 * Extiende `Phaser.Physics.Arcade.Image` y está preparada para funcionar
 * con el sistema de física Arcade. Si la bala no tiene cuerpo físico (por
 * ejemplo en algunos contextos de test o cuando la física no está activa),
 * los métodos de disparo usan tweens como respaldo para desplazar y
 * destruir la bala.
 *
 * Comportamiento clave:
 * - Inicialmente inactiva y oculta.
 * - Al disparar se posiciona, se activa y se hace visible.
 * - Cuando sale del área visible (con un margen) se destruye para liberar
 *   recursos.
 */
export class BulletP extends Phaser.Physics.Arcade.Image {
    /**
     * Crea una instancia de `BulletP` y la añade a la escena y al mundo
     * de físicas.
     *
     * @param scene - Escena Phaser donde vive la bala.
     * @param x - Posición X inicial (por defecto 0).
     * @param y - Posición Y inicial (por defecto 0).
     * @param texture - Key de la textura a usar (por defecto 'bullet').
     */
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0, texture: string = 'bullet') {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        
        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            // Bala sin gravedad y sin colisión con los límites del mundo
            body.setAllowGravity(false);
            body.setCollideWorldBounds(false);
            body.onWorldBounds = true;
        }
    }

    /**
     * Actualización previa de la renderización. Se usa para comprobar si la
     * bala ha salido del área visible (con un margen de 50px) y, en ese caso,
     * desactivarla y destruirla.
     *
     * Nota: Phaser invoca `preUpdate` internamente en su ciclo de vida.
     */
    preUpdate() {
        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            if (this.y < -50 || this.y > this.scene.scale.height + 50) {
                this.setActive(false);
                this.setVisible(false);
                body.enable = false;
                this.destroy();
            }
        }
    }

    /**
     * Dispara la bala verticalmente estableciendo la velocidad en Y.
     *
     * Si existe un cuerpo físico, se usa `setVelocity`. En caso contrario se
     * utiliza un tween que simula el movimiento y destruye la bala al
     * completar la animación.
     *
     * @param x - Posición X donde aparecerá la bala.
     * @param y - Posición Y donde aparecerá la bala.
     * @param velocityY - Velocidad en el eje Y (positivo hacia abajo).
     */
    fire(x: number, y: number, velocityY: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            body.enable = true;
            body.setVelocity(0, velocityY);
        } else {
            // Respaldo: tween que lleva la bala fuera de pantalla y la destruye
            const targetY = -50;
            const distance = Math.abs(this.y - targetY);
            const duration = Math.max(100, (distance / Math.abs(velocityY)) * 1000);
            this.scene.tweens.add({
                targets: this,
                y: targetY,
                duration,
                onComplete: () => { if (this && this.destroy) this.destroy(); }
            });
        }
    }

    /**
     * Dispara la bala en una dirección dada por un ángulo en grados y una
     * velocidad escalar.
     *
     * - `angleDeg` está en grados (0º apunta a la derecha, 90º hacia abajo).
     * - Calcula la componente X e Y de la velocidad y la aplica al cuerpo.
     * - Si no hay cuerpo físico, usa un tween de respaldo que mueve la bala
     *   hacia una posición lejana según la dirección.
     *
     * @param x - Posición X inicial.
     * @param y - Posición Y inicial.
     * @param speed - Velocidad escalar (px/s).
     * @param angleDeg - Ángulo en grados.
     */
    fireAngle(x: number, y: number, speed: number, angleDeg: number) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        const rad = (angleDeg * Math.PI) / 180;
        const vx = Math.cos(rad) * speed;
        const vy = Math.sin(rad) * speed;
        const body = this.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            body.enable = true;
            body.setVelocity(vx, vy);
        } else {
            const targetX = this.x + Math.cos(rad) * 2000;
            const targetY = this.y + Math.sin(rad) * 2000;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
            const duration = Math.max(100, (distance / Math.max(1, speed)) * 1000);
            this.scene.tweens.add({
                targets: this,
                x: targetX,
                y: targetY,
                duration,
                onComplete: () => { if (this && this.destroy) this.destroy(); }
            });
        }
    }

}
