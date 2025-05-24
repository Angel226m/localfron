 
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
// Importa otros reducers según sea necesario
// import usuarioReducer from './slices/usuarioSlice';
// import sedeReducer from './slices/sedeSlice';
// ...etc

// Configura la tienda Redux con todos los reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Agrega otros reducers según sea necesario
    // usuario: usuarioReducer,
    // sede: sedeReducer,
    // ...etc
  },
  // Middleware opcional y otras configuraciones
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora ciertas acciones o paths para evitar errores de serializabilidad
        ignoredActions: ['auth/login/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Exporta los tipos RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hook opcional para usar dispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;