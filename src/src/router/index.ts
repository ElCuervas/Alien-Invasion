import { createRouter, createWebHashHistory } from 'vue-router';
import MainMenu from '../views/MainMenu.vue';
import GamePage from '../views/GamePage.vue';
import OptionsPage from '../views/OptionsPage.vue';
import GameOver from '../views/GameOver.vue';
import Ranking from '@/views/RankingPage.vue';
import KeybindsPage from "@/views/KeybindsPage.vue";
import AccessDenied from '@/views/AccessDenied.vue';

/**
 * Arreglo de rutas para la navegación de la aplicación Vue.
 * Cada objeto define el path, nombre y componente asociado a la ruta.
 */
const routes = [
  { path: '/', name: 'Home', component: MainMenu },
  { path: '/game', name: 'Game', component: GamePage },
  { path: '/options', name: 'Options', component: OptionsPage },
  { path: '/game-over', name: 'GameOver', component: GameOver },
  { path: '/ranking', name: 'Ranking', component: Ranking },
  { path: "/keybinds", name: "Keybinds", component: KeybindsPage }, 
  { path: "/access-denied", name: "AccessDenied", component: AccessDenied }
];

/**
 * Instancia principal del router Vue.
 * Utiliza historial web y las rutas definidas para la navegación SPA.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;