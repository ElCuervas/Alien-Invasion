/**
 * Módulo: UserSession
 * 
 * Maneja la sesión actual del usuario autenticado, basada en un token
 * proporcionado por el módulo principal de la biblioteca de juegos.
 */

const TOKEN_KEY = "ufrogamelab-token";

/** Guarda el token proporcionado por el sistema principal. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Obtiene el token actual. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token actual (logout o limpieza). */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Obtiene la información del usuario autenticado desde el backend de cuenta.
 * Usa el token para autenticar la petición.
 */
export async function getAuthenticatedUser(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8080/v1/account/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token inválido o expirado");
    const data = await res.json();

    // Ajusta según la estructura que devuelva el backend
    return data.username || data.user?.username || null;
  } catch (err) {
    console.warn("No se pudo obtener el usuario autenticado:", err);
    return null;
  }
}
