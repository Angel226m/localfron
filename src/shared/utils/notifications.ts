 
// Puedes usar una biblioteca como react-toastify, sweetalert2 o similar
// Aquí voy a implementar una versión que funciona con react-toastify

import { toast, ToastOptions } from 'react-toastify';

// Configuración básica para los toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Opciones para diferentes tipos de notificaciones
const successOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 3000,
};

const errorOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 6000, // Dar más tiempo para leer errores
};

const warningOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4000,
};

const infoOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 3000,
};

// Función para manejar notificaciones de éxito
const success = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...successOptions, ...options });
};

// Función para manejar notificaciones de error
const error = (message: string | null | undefined, options?: ToastOptions) => {
  // Si el mensaje es null o undefined, mostrar un mensaje genérico
  const displayMessage = message || 'Se produjo un error inesperado';
  toast.error(displayMessage, { ...errorOptions, ...options });
};

// Función para manejar notificaciones de advertencia
const warning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...warningOptions, ...options });
};

// Función para manejar notificaciones informativas
const info = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...infoOptions, ...options });
};

// Función para mostrar un mensaje de carga
const loading = (message: string = 'Cargando...', options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

// Función para actualizar un toast existente (útil para actualizar toast de carga)
const update = (id: string, options: any) => {
  toast.update(id, options);
};

// Función para cerrar un toast específico
const dismiss = (id?: string) => {
  if (id) {
    toast.dismiss(id);
  } else {
    toast.dismiss();
  }
};

// Exportar todas las funciones
export const notifications = {
  success,
  error,
  warning,
  info,
  loading,
  update,
  dismiss
};