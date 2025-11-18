import Phaser, { AUTO } from 'phaser';
import { Boot } from '@/game/scenes/Boot';
import { Preloader } from '@/game/scenes/Preloader';
import { Game } from '@/game/scenes/Game';
import { loadControlConfig } from '@/config/ControlSettings';

loadControlConfig();

/**
 * Configuración principal del juego Phaser.
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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

/**
 * Inicializa la instancia del juego y la guarda globalmente
 * para que Vue pueda reproducir sonidos en GameButton.vue
 */
const StartGame = (parent: string) => {

    const instance = new Phaser.Game({ ...config, parent });

    (window as any).phaserGameInstance = instance;

    return instance;
};

export default StartGame;
