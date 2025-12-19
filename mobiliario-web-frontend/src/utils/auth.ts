import { jwtDecode } from 'jwt-decode';

/**
 * Verifica si el JWT ha expirado.
 * @param {string} token El token JWT a validar.
 * @returns {boolean} True si el token es inválido o ha expirado, False si aún es válido.
 */
export function isTokenExpired(token: string): boolean {
    if (!token) {
        return true; // No hay token, se considera "expirado" o inválido.
    }

    try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp; // Timestamp UNIX en segundos

        // Compara el tiempo de expiración (exp) con la hora actual (en segundos)
        const currentTime = Date.now() / 1000;

        // Si la hora actual es mayor que el tiempo de expiración, ha caducado.
        // @ts-ignore
        return currentTime > expirationTime;
    } catch (error) {
        // Maneja errores de decodificación (token malformado, etc.)
        console.error("Error al decodificar el token:", error);
        return true;
    }
}