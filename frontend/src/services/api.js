import axios from 'axios';

// Backend Node/Express (antes apuntaba a Django en :8000). Configurable via
// REACT_APP_API_URL en frontend/.env si el backend corre en otro host/puerto.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// CLIENTES
export const getClientes = () => api.get('clientes/');
export const createCliente = (data) => api.post('clientes/', data);

// OTROS
export const getTransacciones = () => api.get('transacciones/');

export default api;
