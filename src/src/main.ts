import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/style.css';
import { GameAPI } from './config/GameAPI';

// Montar la app para usar vistas
createApp(App).use(router).mount('#app');

/**
 * Inicializa la validación de sesión del juego.
 * Extrae `token` y `gameId` de los parámetros URL.
 * Si faltan o son inválidos, redirige a `AccessDenied`.
 */
async function initGame() {
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const gameId = params.get('gameId');

	if (!token || !gameId) {
		router.push({ name: 'AccessDenied' });
		return;
	}

	const api = new GameAPI(token, gameId);

	try {
		const isValid = await api.validateSession();
		if (isValid) {
			console.log('Sesión validada correctamente.');
			(window as any).gameApi = api;
		} else {
			console.error('Token rechazado por el servidor.');
			router.push({ name: 'AccessDenied' });
		}
	} catch (err) {
		console.error('Error de sesión:', err);
		router.push({ name: 'AccessDenied' });
	}
}

// Inicializacion
initGame();
