<script setup lang="ts">
/**
 * Componente PhaserGame
 * Renderiza el contenedor del juego Phaser y gestiona su ciclo de vida.
 * Expone la instancia del juego y la escena activa, y emite eventos cuando la escena está lista.
 */
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './game/EventBus';
import StartGame from './game/main';
import Phaser from 'phaser';

/** Referencia reactiva a la escena activa de Phaser */
const scene = ref();
/** Referencia reactiva a la instancia del juego Phaser */
const game = ref();

/** Emisor de eventos para comunicar la escena activa */
const emit = defineEmits(['current-active-scene']);

/**
 * Al montar, inicializa el juego y escucha el evento de escena lista.
 */
onMounted(() => {
    game.value = StartGame('game-container');

    // Guardamos la instancia globalmente de forma segura
    (window as any).phaserGameInstance = game.value;
    (game.value as any).isDestroyed = false;

    EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
        emit('current-active-scene', scene_instance);
        scene.value = scene_instance;
    });
});

/**
 * Al desmontar, destruye la instancia del juego para liberar recursos.
 */
onUnmounted(() => {
    try {
        if (game.value) {
            // Marca la instancia como destruida para evitar que GameButton la use
            (game.value as any).isDestroyed = true;

            // Destruye Phaser sin errores
            game.value.destroy(true);
            game.value = null;
        }

        // Limpia la referencia global
        (window as any).phaserGameInstance = null;

    } catch (err) {
        console.warn("⚠ Error al destruir Phaser:", err);
    }
});

/** Expone las referencias de escena y juego para acceso externo */
defineExpose({ scene, game });
</script>

<template>
    <div id="game-container"></div>
</template>
