import axios from 'axios';
import {
  API_BASE_URL,
  getAccessToken,
  getCsrfToken,
  refreshSession,
  refreshCsrf,
  clearSession,
} from './auth';

export { API_BASE_URL };

const api = axios.create({
  baseURL: API_BASE_URL,
});

const METODOS_SEGUROS = ['get', 'head', 'options'];

// Adjunta el JWT y, en las peticiones que modifican datos, el token CSRF.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrf = getCsrfToken();
  if (csrf && !METODOS_SEGUROS.includes((config.method || 'get').toLowerCase())) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

// 401: el access token expiro -> se renueva con el refresh token y se reintenta una vez.
// 403 por CSRF: se pide un token nuevo y se reintenta una vez.
// Si la renovacion falla, se cierra la sesion y la app vuelve al login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (!response || !config) return Promise.reject(error);

    if (response.status === 401 && !config._reintentado) {
      config._reintentado = true;
      try {
        await refreshSession();
        return api(config);
      } catch (refreshError) {
        clearSession();
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(error);
      }
    }

    if (response.status === 403 && /csrf/i.test(response.data?.detail || '') && !config._csrfReintentado) {
      config._csrfReintentado = true;
      try {
        await refreshCsrf();
        return api(config);
      } catch (csrfError) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// LOTES CERDOS
export const getLotes = () => api.get('lotes-cerdos/');
export const createLote = (data) => api.post('lotes-cerdos/', data);
export const updateLote = (id, data) => api.patch(`lotes-cerdos/${id}/`, data);

// LOTES VACAS (reemplaza al antiguo modulo de Cultivos)
export const getVacas = () => api.get('lotes-vacas/');
export const createVaca = (data) => api.post('lotes-vacas/', data);
export const updateVaca = (id, data) => api.patch(`lotes-vacas/${id}/`, data);

// INVENTARIO / CONSUMOS
export const getProductos = () => api.get('productos/');
export const getConsumos = () => api.get('consumos-alimento/');
export const createConsumo = (data) => api.post('consumos-alimento/', data);

// VENTAS
export const getVentas = () => api.get('ventas/');
export const createVenta = (data) => api.post('ventas/', data);
// La factura exige sesion: se descarga como archivo con el token (un <a href> no lo enviaria).
export const getFacturaPdf = (id) => api.get(`ventas/${id}/factura/`, { responseType: 'blob' });

// CLIENTES
export const getClientes = () => api.get('clientes/');
export const createCliente = (data) => api.post('clientes/', data);

// OTROS
export const getTransacciones = () => api.get('transacciones/');

// CUENTA
export const changePassword = (currentPassword, newPassword) =>
  api.post('auth/change-password/', { current_password: currentPassword, new_password: newPassword });

export default api;
