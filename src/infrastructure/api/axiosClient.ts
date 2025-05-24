import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store'; // Asegúrate de ajustar la ruta a tu store
import { refreshToken } from '../store/slices/authSlice'; // Ajusta según tu estructura

// Obtener la URL base desde variables de entorno
const baseURL = import.meta.env.VITE_API_URL || '/api/v1'; // Usa ruta relativa

// Definir tipo para la cola de solicitudes fallidas
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

// Variables para controlar el refresh
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Procesar la cola de solicitudes fallidas
const processQueue = (error: Error | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para cookies
});

// Interceptor para peticiones - CORREGIDO para usar InternalAxiosRequestConfig
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`Enviando petición a: ${config.url}`, config.data);
    return config;
  },
  (error: AxiosError) => {
    console.error('Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas con manejo de renovación de token
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`Respuesta de ${response.config.url}:`, response.status, response.data);
    return response;
  },
  async (error: AxiosError) => {
    // Añadir comprobación para asegurarnos de que config está definido
    if (!error.config) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Si es un error 401 y no estamos intentando hacer refresh y no es una solicitud de refresh
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        originalRequest.url !== '/auth/refresh') {
      
      // Verificar si tenemos refresh_token en las cookies
      const hasRefreshToken = document.cookie.includes('refresh_token=');
      
      if (hasRefreshToken) {
        // Si ya estamos en proceso de refresh, poner esta solicitud en cola
        if (isRefreshing) {
          return new Promise<unknown>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosClient(originalRequest))
            .catch(err => Promise.reject(err));
        }
        
        // Marcar que estamos intentando renovar y que esta es una solicitud de reintento
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Intentar renovar el token
          console.log('Interceptor: Detectado error 401, intentando refrescar token...');
          await store.dispatch(refreshToken());
          
          // Procesar cola de solicitudes pendientes
          processQueue();
          isRefreshing = false;
          
          // Reintentar la solicitud original
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Si falla la renovación, procesar cola con error
          processQueue(refreshError instanceof Error ? refreshError : new Error('Error al refrescar token'));
          isRefreshing = false;
          
          // Solo redirigir a login si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            console.log('Error renovando token, redirigiendo a login...');
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, redirigir al login
        if (!window.location.pathname.includes('/login')) {
          console.log('No hay refresh_token, redirigiendo a login...');
          window.location.href = '/login';
        }
      }
    }
    
    // Para otros errores, simplemente rechazar
    console.error(`Error en respuesta de ${originalRequest?.url || 'desconocido'}:`, 
      error.response?.status || 'sin status', 
      error.response?.data || error.message
    );
    
    return Promise.reject(error);
  }
);

export default axiosClient;