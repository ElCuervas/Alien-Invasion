/**
 * Provee métodos para interactuar con la API del portal de juegos.
 */
export class GameAPI {
    // Apunta al backend
    private readonly BASE_URL = 'http://localhost:8080/v1';

    private gameId: string;
    private token: string;

    constructor(token: string, gameId: string) {
        this.gameId = gameId;
        this.token = token;
    }

    /**
     * Construye los encabezados HTTP para las peticiones.
     * @param json Indica si se debe incluir el encabezado Content-Type: application/json
     * @returns Objeto con los encabezados HTTP
     */
    private getHeaders(json = true) {
        const headers: Record<string, string> = {};
        if (json) headers['Content-Type'] = 'application/json';
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        return headers;
    }

    /**
     * Valida la sesión de juego en el backend.
     * @returns Verdadero si la sesión es válida, falso en caso contrario
     */
    public async validateSession(): Promise<boolean> {
        const url = `${this.BASE_URL}/collection/my-games/${this.gameId}/launch-info`;
        try {
            const res = await fetch(url, { headers: this.getHeaders(false) });
            if (!res.ok) {
                console.error('Validación de sesión::', res.status);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Validación de sesión fallida:', error);
            return false;
        }
    }

    /**
     * Actualiza la sesión de juego en el backend.
     * @param payload Datos de la sesión a actualizar
     * @returns Respuesta del servidor
     */
    public async updateSession(payload: SessionUpdate): Promise<any> {
        const url = `${this.BASE_URL}/collection/my-games/${this.gameId}/session-update`;
        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log('Session actualizada:', data);
            return data;
        } catch (error) {
            console.error('Error al actualizar sesión:', error);
            throw error;
        }
    }

    /**
     * Recupera el ranking de jugadores desde el backend.
     * @returns Array de entradas del ranking
     */
    public async getLeaderboard(): Promise<Leaderboard[]> {
        const url = `${this.BASE_URL}/collection/leaderboards/${this.gameId}`;
        try {
            const res = await fetch(url, { headers: this.getHeaders(false) });
            if (!res.ok) {
                console.error('Error al obtener ranking:', res.status);
                return [];
            }
            const data = await res.json();
            if (data && Array.isArray(data.data)) return data.data as Leaderboard[];
            return [];
        } catch (error) {
            console.error('Error en la API con Ranking:', error);
            return [];
        }
    }
}
export interface Leaderboard {
    rank: number;
    score: number;
    username: string;
}

interface SessionUpdate {
    gameSessionDurationSeconds: number;
    scoreAchieved: number;
}
