import Phaser, { AUTO } from 'phaser';
import { Boot } from '@/game/scenes/Boot';
import { Preloader } from '@/game/scenes/Preloader';
import { Game } from '@/game/scenes/Game';

/**
 * Configuración principal del juego Phaser.
 * Define tamaño, escenas, física y escalado.
 */
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 894,
    height: 1014,
    parent: 'game-container',
    backgroundColor: '#000000ff',
    scene: [
        Boot,
        Preloader,
        Game
    ],
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};


/**
 * Inicializa y retorna una instancia de Phaser.Game con el contenedor especificado.
 * @param parent ID del elemento HTML donde se renderiza el juego.
 * @returns Instancia de Phaser.Game
 */
const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
