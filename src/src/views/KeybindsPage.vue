<template>
  <div class="keybinds">

    <h1>Configurar Controles</h1>

    <div class="action-row" v-for="(value, action) in bindings" :key="action">
      <span class="label">{{ actionLabels[action] }}</span>

      <button class="key-button" @click="handleKeyButtonClick(action)">
        {{ waiting === action ? "Presiona una tecla..." : value }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <GameButton @click="resetAll" class="reset-btn">Restablecer</GameButton>
    <GameButton @click="goBack" class="back-btn">Volver</GameButton>

  </div>
</template>

<script setup lang="ts">
/**
 * Vista KeybindsPage
 * 
 * Permite al usuario configurar las teclas de control del juego.
 * Incluye rebinding dinámico, validación de teclas y acciones para
 * restablecer o regresar al menú anterior.
 */

import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { playClickSound } from "@/utils/htmlSound";

import GameButton from "../components/GameButton.vue";
import {
  getControlConfig,
  setControlKey,
  resetControls,
  ControlConfig
} from "@/config/ControlSettings";

const router = useRouter();

/** Configuración actual de los controles del usuario. */
const bindings = ref<ControlConfig>({ ...getControlConfig() });

/** Texto visible para cada acción configurable. */
const actionLabels: Record<keyof ControlConfig, string> = {
  moveUp: "Mover Arriba",
  moveDown: "Mover Abajo",
  moveLeft: "Mover Izquierda",
  moveRight: "Mover Derecha",
  shoot: "Disparar"
};

/** Acción que está esperando que el usuario presione una tecla. */
const waiting = ref<keyof ControlConfig | null>(null);

/** Mensaje de error al intentar asignar una tecla inválida o duplicada. */
const error = ref("");

/**
 * Maneja el evento de click en un botón de reconfiguración.
 * Reproduce un sonido y activa el modo de escucha de teclado.
 * 
 * @param action Acción del control que será reconfigurada.
 */
function handleKeyButtonClick(action: keyof ControlConfig) {
  playClickSound();
  startRebinding(action);
}

/**
 * Activa el modo de espera para asignar una nueva tecla.
 * Escucha la próxima tecla presionada por el usuario.
 * 
 * @param action Acción a la cual se le asignará una nueva tecla.
 */
function startRebinding(action: keyof ControlConfig) {
  waiting.value = action;
  error.value = "";

  const handler = (event: KeyboardEvent) => {
    event.preventDefault();

    const ok = setControlKey(action, event.key);

    if (!ok) {
      error.value = "Esa tecla ya está asignada a otra acción.";
    } else {
      bindings.value[action] = event.key;
      error.value = "";
    }

    waiting.value = null;
    window.removeEventListener("keydown", handler);
  };

  window.addEventListener("keydown", handler);
}

/**
 * Restablece las teclas de control a sus valores predeterminados.
 */
function resetAll() {
  playClickSound();
  resetControls();
  bindings.value = { ...getControlConfig() };
}

/**
 * Regresa al menú de opciones.
 */
function goBack() {
  playClickSound();
  router.push({ name: "Options" });
}

/**
 * Maneja la tecla ESC para volver automáticamente al menú anterior.
 * 
 * @param e Evento de teclado recibido por la ventana.
 */
function onEscPress(e: KeyboardEvent) {
  if (e.key === "Escape") {
    playClickSound();
    router.push({ name: "Options" });
  }
}

window.addEventListener("keydown", onEscPress);

onUnmounted(() => {
  window.removeEventListener("keydown", onEscPress);
});
</script>

<style scoped>
.keybinds {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-top: 40px;
  padding: 0 20px;
  color: #ff0000;
  width: 100%;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  font-size: clamp(22px, 4vw, 40px);
  margin-bottom: 20px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: min(450px, 100%);
  font-size: clamp(14px, 2.3vw, 20px);

  gap: 10px;
}

.label {
  width: 50%;
  text-align: left;
  word-break: break-word;
}

.key-button {
  width: 50%;
  padding: clamp(6px, 1.5vw, 10px);
  font-size: clamp(14px, 2.3vw, 18px);

  background: #222;
  border: 2px solid #ff0000;
  color: #ff0000;
  cursor: pointer;

  transition: 0.15s ease;
}

.key-button:hover {
  background: #440000;
}

.error {
  color: yellow;
  font-size: clamp(14px, 2vw, 16px);
  text-align: center;
  max-width: 90%;
}

.reset-btn,
.back-btn {
  margin-top: 10px;
  font-size: clamp(16px, 3vw, 22px);
  padding: 10px 20px;
  width: min(300px, 70%);
}

@media (max-width: 360px) {
  .action-row {
    flex-direction: column;
    align-items: stretch;
  }

  .label,
  .key-button {
    width: 100%;
    text-align: center;
  }
}
</style>
