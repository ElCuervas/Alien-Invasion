import Phaser from "phaser";
import { Player } from "./Player";
import { EventBus } from "../EventBus";

/**
 * Clase que representa una mejora (upgrade) aplicable al jugador.
 * Permite modificar atributos del jugador como salud, daño y cadencia de disparo.
 */
export class Upgrade extends Phaser.Physics.Arcade.Sprite {
    /**
     * Referencia al jugador que recibirá la mejora.
     */
    player: Player;

    /**
     * Crea una instancia de Upgrade.
     * @param scene Escena de Phaser donde se añade la mejora.
     * @param x Posición X inicial.
     * @param y Posición Y inicial.
     * @param texture Nombre de la textura del sprite de mejora.
     * @param player Instancia del jugador a mejorar.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
        super(scene, x, y, texture);
        this.player = player;
    }
    /**
     * Aplica una mejora de salud al jugador, aumentando su vida máxima y restaurando la vida actual.
     */
    upgrade_health() {
        this.player.health_all += 20;
        this.player.health = this.player.health_all;
    }
    /**
     * Aplica una mejora de daño al jugador, aumentando el daño de sus ataques.
     */
    upgrade_damange() {
        (this.player as any).damage += 2;
    }
    /**
     * Aplica una mejora de cadencia de disparo al jugador, permitiéndole disparar más rápido.
     */
    upgrade_bullet() {
        (this.player as any).cadence_bullet -= 50;
    }
    /**
     * Aplica una mejora al jugador según la opción seleccionada.
     * 1: Salud, 2: Daño, 3: Cadencia de disparo.
     * Reinicia la experiencia y sube el nivel del jugador.
     * @param option Número de opción de mejora.
     */
    upgrade_exp(option: number) {
        switch (option) {
            case 1:
                this.upgrade_health();
                break;
            case 2:
                this.upgrade_damange();
                break;
            case 3:
                this.upgrade_bullet();
                break;
            default:
                break;
        }
        // Reinicia la experiencia del jugador para el siguiente nivel y lo sube
        this.player.exp_all += 200;
        this.player.exp = 0;
        try {
            this.scene.scene.resume(this.scene as any);
        } catch (err) {
            try { this.scene.scene.resume((this.scene as any).scene?.key || (this.scene as any).sys?.settings?.key) } catch(e) {}
        }
        EventBus.emit('player:levelup', 1);
    }
}