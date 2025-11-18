import Phaser from 'phaser'
import { BulletP } from './BulletP'

/**
 * Enemigo del juego con diferentes patrones de movimiento y capacidad de
 * disparo.
 *
 * Comportamiento principal:
 * - Soporta varios patrones (horizontal, sine, zigzag, static, etc.).
 * - Gestiona spawn inicial para entrar suavemente en pantalla.
 * - Dispara balas usando un grupo de `BulletP`.
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
    /** Velocidad de movimiento horizontal (px/s). */
    speed: number = 200
    /** Estado de flip para dirección horizontal (1 = derecha, 0 = izquierda). */
    flip = 1
    /** Grupo de balas que disparará el enemigo. */
    bullets: Phaser.Physics.Arcade.Group | undefined
    /** Vida/vidas del enemigo. */
    hearts: number = 2
    /** Patrón de movimiento actual. */
    pattern: 'horizontal' | 'sine' | 'zigzag' | 'circular' | 'vertical' | 'static' | 'random' = 'horizontal'
    /** Parámetros específicos para el patrón (amplitud, velocidad, etc.). */
    patternParams: any = {}
    /** Indica si el enemy aún está en fase de spawn inicial. */
    spawn = true;
    /** Posición final en Y a la que debe arribar tras el spawn. */
    spawn_final_position: number = 0;
    /** Selector de tipo de disparo (0 = simple, 1 = triple). */
    select_bullet: number = 0;
    /** Marca de tiempo del inicio (ms) para cálculos de patrón. */
    private _t0: number = 0
    /** Intervalo base entre disparos (ms). */
    private shotInterval: number = 1000
    /** Variación aleatoria en el intervalo de disparo (ms). */
    private shotJitter: number = 400
    /** Marca de tiempo del próximo disparo permitido (ms). */
    private nextShotAt: number = 0

    /**
     * Crea un enemigo y lo añade a la escena con físicas.
     *
     * @param scene - Escena Phaser donde se crea el enemigo.
     * @param x - Posición X inicial.
     * @param y - Posición Y inicial (también usada como posición objetivo tras spawn).
     * @param texture - Key de la textura/sprite a usar.
     * @param pattern - (Opcional) patrón de movimiento inicial.
     * @param params - (Opcional) parámetros del patrón (amp, freq, vspeed, shotInterval, etc.).
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, pattern?: string, params?: any) {
        super(scene, x, y - 600, texture)
        this.spawn_final_position = y;
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setActive(true)
        this.setCollideWorldBounds(true)

        this._t0 = scene.time.now

        // Configuración del patrón de movimiento
        if (pattern) this.pattern = pattern as any
        this.patternParams = params || {}

        // Grupo de balas del tipo BulletP
        this.bullets = scene.physics.add.group({
            classType: BulletP,
            runChildUpdate: true,
            maxSize: 10,
        })
        this.shotInterval = this.patternParams.shotInterval ?? 1000
        this.shotJitter = this.patternParams.shotJitter ?? 400
        this.nextShotAt = this._t0 + Math.random() * this.shotInterval
    }

    /**
     * Actualiza la lógica del enemigo cada frame.
     *
     * - Gestiona el spawn inicial (movimiento suave hasta `spawn_final_position`).
     * - Ejecuta el patrón de movimiento configurado.
     * - Controla el temporizador de disparo y dispara según corresponda.
     *
     * @param delta - Tiempo transcurrido desde el último frame en ms.
     */
    update(delta: number) {
        if (this.pattern=='static'){
            this.setCollideWorldBounds(false);
            this.y = -600
        }else{
            this.setCollideWorldBounds(false);
        }
        // Manejo de spawn inicial  
        if (this.y < this.spawn_final_position) {
            const dt = delta / 1000
            const dy = this.spawn_final_position - this.y
            const k = 6
            this.y += dy * Math.min(1, k * dt)
            if (Math.abs(dy) < 1) this.y = this.spawn_final_position
            return
        }
        // Ejecuta el patrón de movimiento
        this.setCollideWorldBounds(true);
        this.PatronOptions(delta)
        // Lógica de disparo
        const now = this.scene.time.now
        if (now >= this.nextShotAt) {
            switch (this.select_bullet){
                case 0:
                    this.ShootBullet(600, 0, 0)
                    break;
                case 1:
                    this.ShootBullet2()
                    break;
                case 2:
                    this.ShootBullet3()
                    break;
            }
            // Programa el próximo disparo
            this.nextShotAt = now + (this.patternParams.shotInterval ?? this.shotInterval) + Math.random() * this.shotJitter
        }
    }

    /**
     * Dispara una bala recta en una posicion asignada.
     *
     * @param speed - Velocidad escalar de la bala (px/s).
     * @param posicionX - Desplazamiento en X desde la posición del enemigo.
     * @param posicionY - Desplazamiento en Y desde la posición del enemigo.
     */
    ShootBullet(speed: number, posicionX: number, posicionY: number) {
        if (!this.bullets) return
        const a = this.bullets.get(this.x, this.y - this.displayHeight, 'bullet') as BulletP | null
        if (a) {
            a.fire(this.x + posicionX, (this.y + posicionY) + this.displayHeight / 2 - 10, speed)
        }
    }

    /**
     * Dispara tres balas en ángulos (forma de abanico).
     * Ángulos por defecto: [110, 90, 70].
     */
    ShootBullet2() {
        const angles = [110, 90, 70]
        const speed = 600
        this.bulletAngular(angles, speed, 0, 0);
    }

    /**
     * Dispara 2 balas en ángulos.
     * Ángulos por defecto: [110, 70].
     * Dispara además 2 balas rectas a los lados interiores.
     */
    ShootBullet3() {
        const angles = [110, 70]
        const speed = 600
        this.bulletAngular(angles, speed, -70, -40);
        this.bulletAngular(angles, speed, 70, -40);
        this.ShootBullet(600, -35, -50);
        this.ShootBullet(600, 35, -50);
    }

    /**
     * Patrones de movimiento del enemigo.
     *
     * Soporta varios modos:
     * - `sine`: movimiento senoidal en X + velocidad vertical opcional.
     * - `zigzag`: zigzag vertical con desplazamiento en X.
     * - `horizontal`: se mueve horizontalmente y cambia al chocar contra límites.
     * - `static`: posición fija (por defecto, fuera de pantalla en Y = -600).
     *
     * Los parámetros de cada patrón pueden pasarse en `patternParams`.
     *
     * @param delta - tiempo transcurrido desde el último frame (ms).
     */
    PatronOptions(delta: number) {
        const dt = delta / 1000
        const body = this.body as Phaser.Physics.Arcade.Body | null
        const elapsed = (this.scene.time.now - this._t0) / 1000

        switch (this.pattern) {
            case 'sine': {
                const amp = this.patternParams.amp ?? 50
                const freq = this.patternParams.freq ?? 1
                const cx = this.patternParams.cx ?? this.x
                this.x = cx + Math.sin(elapsed * freq * Math.PI * 2) * amp
                this.y += (this.patternParams.vspeed ?? 0) * dt
                break
            }
            case 'zigzag': {
                const amp = this.patternParams.amp ?? 80
                const period = this.patternParams.period ?? 0.5
                this.y += (this.patternParams.vspeed ?? 30) * dt
                this.x += Math.sin(elapsed / period) * amp * dt
                break
            }
            case 'horizontal':
            default: {
                if (this.flip === 1) {
                    this.x += this.speed * dt
                    if (body && body.blocked && body.blocked.right) this.flip = 0
                } else if (this.flip === 0) {
                    this.x -= this.speed * dt
                    if (body && body.blocked && body.blocked.left) this.flip = 1
                }
                break
            }
            case 'static': {
                this.setCollideWorldBounds(false);
                this.y = -600
                break
            }
        }
        
    }

    /**
     * Dispara múltiples balas en ángulos especificados.
     *
     * @param angles - Array de ángulos en grados para disparar las balas.
     * @param speed - Velocidad escalar de las balas (px/s).
     * @param posicionX - Desplazamiento en X desde la posición del enemigo.
     * @param posicionY - Desplazamiento en Y desde la posición del enemigo.
     */
    bulletAngular(angles: number[], speed: number, posicionX: number, posicionY: number) {
        if (!this.bullets) return
        for (const angle of angles) {
            const a = this.bullets.get(this.x, this.y - this.displayHeight, 'bullet') as BulletP | null
            if (a) {
                a.fireAngle(this.x + posicionX, (this.y + posicionY) + this.displayHeight / 2 - 10, speed, angle)
            }
        }
    }
}