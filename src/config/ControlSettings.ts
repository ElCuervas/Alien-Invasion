export interface ControlConfig {
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  shoot: string;
}

const DEFAULT_CONFIG: ControlConfig = {
  moveUp: "W",
  moveDown: "S",
  moveLeft: "A",
  moveRight: "D",
  shoot: "P"
};

let config: ControlConfig = { ...DEFAULT_CONFIG };

// Cargar desde localStorage
export function loadControlConfig() {
  const raw = localStorage.getItem("control-config");
  if (raw) {
    try {
      config = { ...config, ...JSON.parse(raw) };
    } catch {
      console.warn("Config corrupta — usando valores por defecto.");
    }
  }
}

// Obtener config actual
export function getControlConfig(): ControlConfig {
  return config;
}

// Guardar y evitar duplicados
export function setControlKey(action: keyof ControlConfig, key: string): boolean {
  // Validación anti-duplicados
  for (const otherAction in config) {
    if (otherAction !== action && config[otherAction as keyof ControlConfig] === key) {
      return false; // ya está usada por otra acción
    }
  }

  config[action] = key;
  localStorage.setItem("control-config", JSON.stringify(config));
  return true;
}

// Restablecer valores por defecto
export function resetControls() {
  config = { ...DEFAULT_CONFIG };
  localStorage.setItem("control-config", JSON.stringify(config));
}
