// Sesion del usuario: tokens y renovacion. No depende de api.js (evita imports circulares):
// usa su propia instancia de axios, sin interceptores, para login/refresh/csrf.
import axios from 'axios';

// Backend Node/Express. Configurable via REACT_APP_API_URL en frontend/.env.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/';

const REFRESH_KEY = 'refresh_token';
const bare = axios.create({ baseURL: API_BASE_URL });

// El access token y el token CSRF viven solo en memoria (no los lee un script
// inyectado desde el almacenamiento del navegador). El refresh token persiste en
// localStorage para que la sesion sobreviva a recargar la pagina.
let accessToken = null;
let csrfToken = null;
let refreshInFlight = null;

export const getAccessToken = () => accessToken;
export const getCsrfToken = () => csrfToken;

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch (e) {
    return null;
  }
}

function saveRefreshToken(token) {
  try {
    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  } catch (e) {
    /* almacenamiento no disponible: la sesion durara hasta recargar */
  }
}

export function clearSession() {
  accessToken = null;
  csrfToken = null;
  saveRefreshToken(null);
  try {
    localStorage.removeItem('access_token'); // clave usada por versiones anteriores
  } catch (e) {
    /* nada */
  }
}

function applySession({ access, refresh, csrf_token: csrf }) {
  if (access) accessToken = access;
  if (csrf) csrfToken = csrf;
  if (refresh) saveRefreshToken(refresh);
}

export async function login(username, password) {
  const { data } = await bare.post('auth/login/', { username, password });
  applySession(data);
  return data.user;
}

/** Pide un access token nuevo con el refresh token. Una sola peticion a la vez. */
export function refreshSession() {
  const refresh = getRefreshToken();
  if (!refresh) return Promise.reject(new Error('Sin sesion'));
  if (!refreshInFlight) {
    refreshInFlight = bare
      .post('auth/refresh/', { refresh })
      .then(({ data }) => {
        applySession(data);
        return data.user;
      })
      .catch((err) => {
        clearSession();
        throw err;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/** Renueva el token CSRF (p. ej. si expiro) con la sesion actual. */
export async function refreshCsrf() {
  const { data } = await bare.get('auth/csrf/', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  csrfToken = data.csrf_token;
  return csrfToken;
}
