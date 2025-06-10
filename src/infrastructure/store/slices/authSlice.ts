 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from '../../api/axiosClient';
import { endpoints } from '../../api/endpoints';

// Definición de tipos
export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  id_sede: number | null;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  tipo_documento?: string;
  numero_documento?: string;
  fecha_registro?: string;
  eliminado?: boolean;
}

export interface Sede {
  id_sede: number;
  nombre: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  provincia?: string;
  pais?: string;
  eliminado?: boolean;
}

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  availableSedes: Sede[];
  selectedSede: Sede | null;
  sessionChecked: boolean; // Estado para evitar ciclos
  isRefreshing: boolean; // Nuevo: controla si estamos actualizando el token
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  availableSedes: [],
  selectedSede: null,
  sessionChecked: false, // Inicialmente no hemos verificado la sesión
  isRefreshing: false, // Inicialmente no estamos actualizando el token
};

// Función auxiliar para verificar cookies
// Esta función permite depuración visual de las cookies
export const getAuthCookies = () => {
  const cookies = document.cookie;
  console.log("Todas las cookies:", cookies);
  
  // Extraer cookies individuales
  const cookiesArray = cookies.split('; ');
  const cookiesObj: Record<string, string> = {};
  
  cookiesArray.forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0];
      const value = parts.slice(1).join('=');
      cookiesObj[name] = value;
    }
  });
  
  // Verificar cookies específicas
  const hasAccessToken = cookiesObj['access_token'] !== undefined;
  const hasRefreshToken = cookiesObj['refresh_token'] !== undefined;
  
  console.log(`Cookie access_token presente: ${hasAccessToken}`);
  console.log(`Cookie refresh_token presente: ${hasRefreshToken}`);
  
  return {
    hasAccessToken,
    hasRefreshToken,
    hasAnyCookie: hasAccessToken || hasRefreshToken,
    cookiesObj
  };
};

// MODIFICADO: Thunk para refrescar token con fallback
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Intentando refrescar el token con refresh_token...");
      
      // Verificar si tenemos refresh_token antes de intentar
      const cookieStatus = getAuthCookies();
      if (!cookieStatus.hasRefreshToken) {
        console.log("No hay refresh_token disponible para renovar la sesión");
        return rejectWithValue('No hay refresh_token disponible');
      }
      
      // Obtener el valor del token para enviar en el cuerpo como fallback
      const refreshTokenValue = cookieStatus.cookiesObj['refresh_token'];
      
      // Llamar al endpoint de refresh con el token en el cuerpo como fallback
      const response = await axiosClient.post(endpoints.auth.refresh, {
        refresh_token: refreshTokenValue
      });
      
      console.log("Token refrescado exitosamente:", response.data);
      
      // Verificar que se hayan establecido las nuevas cookies
      setTimeout(() => {
        const newCookieStatus = getAuthCookies();
        console.log("Estado de cookies después de refresh:", newCookieStatus);
      }, 100);
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error("Error al refrescar token:", error.response?.status, error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Error al refrescar el token');
    }
  }
);

// Thunk para login
export const login = createAsyncThunk(
  'auth/login',
  async ({ correo, contrasena, rememberMe = false }: { 
    correo: string; 
    contrasena: string; 
    rememberMe?: boolean 
  }, { rejectWithValue }) => {
    try {
      // Enviar credenciales en el body y el parámetro remember_me en la URL
      const response = await axiosClient.post(
        `${endpoints.auth.login}?remember_me=${rememberMe}`, 
        { correo, contrasena }
      );
      
      // Después del login, verificar que las cookies se hayan establecido
      setTimeout(() => {
        const cookieStatus = getAuthCookies();
        console.log("Estado de cookies después de login:", cookieStatus);
      }, 100);
      
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
);

// Thunk para verificar estado de autenticación - ACTUALIZADO
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { dispatch, getState, rejectWithValue }) => {
    // Verificar el estado de las cookies primero
    const cookieStatus = getAuthCookies();
    
    // Si tenemos refresh_token pero no access_token, intentar refrescar
    if (cookieStatus.hasRefreshToken && !cookieStatus.hasAccessToken) {
      console.log("Se detectó refresh_token pero no access_token - intentando renovar token");
      
      try {
        // Intentar refrescar el token antes de verificar el estado
        await dispatch(refreshToken()).unwrap();
        console.log("Token renovado exitosamente, ahora verificando estado");
      } catch (refreshError) {
        console.error("No se pudo refrescar el token:", refreshError);
        // Continuar igual para intentar ver si podemos verificar el estado
      }
    }
    
    // Verificar si hay alguna cookie de autenticación después del posible refresh
    const updatedCookieStatus = getAuthCookies();
    if (!updatedCookieStatus.hasAnyCookie) {
      console.log('No se encontraron cookies de autenticación, omitiendo verificación');
      return rejectWithValue('No hay cookies de autenticación');
    }
    
    try {
      console.log("Verificando estado de autenticación...");
      const response = await axiosClient.get('/auth/status');
      return response.data.data;
    } catch (error: any) {
      // Mejorar el log de errores
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      const statusCode = error.response?.status || 'sin código';
      console.error(`Error en verificación de autenticación: ${statusCode} - ${errorMessage}`);
      
      // Si el error es 401 y tenemos refresh_token, intentar refrescar si no lo hemos hecho ya
      if (error.response?.status === 401) {
        console.log("Error 401, verificando cookies de nuevo:");
        const currentCookies = getAuthCookies();
        
        // Solo intentar refresh si tenemos refresh_token y no hemos intentado refrescar antes
        const authState = getState() as { auth: AuthState };
        if (currentCookies.hasRefreshToken && !authState.auth.isRefreshing) {
          try {
            console.log("Intentando refrescar token después de error 401...");
            await dispatch(refreshToken()).unwrap();
            
            // Intentar verificar estado otra vez con el nuevo token
            console.log("Verificando estado de autenticación con el nuevo token...");
            const retryResponse = await axiosClient.get('/auth/status');
            return retryResponse.data.data;
          } catch (refreshError) {
            console.error("Error al refrescar el token después de 401:", refreshError);
            // Si falla el refresh, seguimos con el rechazo normal
          }
        }
      }
      
      return rejectWithValue('Sesión no iniciada');
    }
  }
);

// Thunk para obtener sedes disponibles para un usuario admin
export const fetchUserSedes = createAsyncThunk(
  'auth/fetchUserSedes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(endpoints.auth.userSedes);
      return response.data.data.sedes || [];
    } catch (error: any) {
      console.error('Error al obtener sedes:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al obtener sedes');
    }
  }
);

// Thunk para seleccionar una sede
export const selectSede = createAsyncThunk(
  'auth/selectSede',
  async (id_sede: number, { rejectWithValue }) => {
    try {
      // Llamar al endpoint para seleccionar sede
      const response = await axiosClient.post(endpoints.auth.selectSede, { id_sede });
      
      // Verificar cookies después de seleccionar sede
      setTimeout(() => {
        getAuthCookies();
      }, 100);
      
      return response.data.data.sede;
    } catch (error: any) {
      console.error('Error al seleccionar sede:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al seleccionar sede');
    }
  }
);

// Thunk para cerrar sesión
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Llamar al endpoint de logout para invalidar las cookies
      await axiosClient.post(endpoints.auth.logout);
      
      // Verificar que las cookies se hayan eliminado
      setTimeout(() => {
        getAuthCookies();
      }, 100);
      
      return null;
    } catch (error: any) {
      console.error('Error durante logout:', error);
      // Aunque haya error, limpiar el estado del usuario
      return null;
    }
  }
);

// Thunk para cambiar contraseña
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { 
    currentPassword: string; 
    newPassword: string 
  }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(endpoints.auth.changePassword, {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para marcar la sesión como verificada
    markSessionAsChecked: (state) => {
      state.sessionChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Refresh Token - NUEVO
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = null;
        // No actualizamos isAuthenticated aquí, eso lo haremos en checkAuthStatus
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.selectedSede = null;
        state.error = action.payload as string || 'Error al refrescar token';
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionChecked = true; // Marcar como verificada
        
        // Manejo seguro de la respuesta
        if (action.payload && action.payload.usuario) {
          state.user = action.payload.usuario;
          
          // Si el usuario tiene sede, establecerla
          if (action.payload.sede) {
            state.selectedSede = action.payload.sede;
          }
        } else {
          // Forma alternativa de respuesta
          state.user = action.payload;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.sessionChecked = true; // Marcar como verificada aunque falle
        state.error = action.payload as string;
      })
      
      // Verificar estado de autenticación
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionChecked = true; // Marcar como verificada
        state.error = null;
        
        if (action.payload?.usuario) {
          state.user = action.payload.usuario;
        }
        if (action.payload?.sede) {
          state.selectedSede = action.payload.sede;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.sessionChecked = true; // Marcar como verificada aunque falle
        state.user = null;
        state.selectedSede = null;
        // No establecer error aquí, es normal que no haya sesión
      })
      
      // Obtener sedes disponibles
      .addCase(fetchUserSedes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSedes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSedes = action.payload || [];
      })
      .addCase(fetchUserSedes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.availableSedes = [];
      })
      
      // Seleccionar sede
      .addCase(selectSede.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectSede.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSede = action.payload;
      })
      .addCase(selectSede.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // Reiniciar el estado completo
        return { ...initialState, sessionChecked: true };
      })
      .addCase(logout.rejected, (state) => {
        // Incluso si hay error en logout, reiniciar el estado
        return { ...initialState, sessionChecked: true };
      })
      
      // Cambio de contraseña
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        // No es necesario modificar otros estados
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, markSessionAsChecked } = authSlice.actions;
export default authSlice.reducer;