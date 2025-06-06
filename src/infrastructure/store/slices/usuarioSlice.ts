 

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Usuario, NuevoUsuarioRequest, ActualizarUsuarioRequest, UsuarioIdioma, AsignarIdiomaRequest } from '../../../domain/entities/Usuario';
import { UsuarioRepoHttp } from '../../repositories/UsuarioRepoHttp';
import axios, { AxiosError } from 'axios';

const usuarioRepo = new UsuarioRepoHttp();

// Función auxiliar para extraer el mensaje de error
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Definir el estado
export interface UsuarioState {
  usuarios: Usuario[];
  usuarioSeleccionado: Usuario | null;
  usuarioIdiomas: UsuarioIdioma[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: UsuarioState = {
  usuarios: [],
  usuarioSeleccionado: null,
  usuarioIdiomas: [],
  loading: false,
  error: null,
};

// Thunks existentes
export const fetchUsuarios = createAsyncThunk(
  'usuarios/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await usuarioRepo.getAll();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUsuarioPorId = createAsyncThunk(
  'usuarios/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await usuarioRepo.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUsuariosPorRol = createAsyncThunk(
  'usuarios/fetchByRol',
  async (rol: string, { rejectWithValue }) => {
    try {
      return await usuarioRepo.getByRol(rol);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createUsuario = createAsyncThunk(
  'usuarios/create',
  async (usuario: NuevoUsuarioRequest, { rejectWithValue }) => {
    try {
      const id = await usuarioRepo.create(usuario);
      return { id, ...usuario };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUsuario = createAsyncThunk(
  'usuarios/update',
  async ({ id, usuario }: { id: number; usuario: ActualizarUsuarioRequest }, { rejectWithValue }) => {
    try {
      await usuarioRepo.update(id, usuario);
      return await usuarioRepo.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteUsuario = createAsyncThunk(
  'usuarios/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await usuarioRepo.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// NUEVOS THUNKS PARA IDIOMAS
export const fetchUsuarioIdiomas = createAsyncThunk(
  'usuarios/fetchIdiomas',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await usuarioRepo.getUsuarioIdiomas(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const asignarIdiomaUsuario = createAsyncThunk(
  'usuarios/asignarIdioma',
  async ({ userId, idioma }: { userId: number; idioma: AsignarIdiomaRequest }, { rejectWithValue }) => {
    try {
      await usuarioRepo.asignarIdioma(userId, idioma);
      return { userId, idioma };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const desasignarIdiomaUsuario = createAsyncThunk(
  'usuarios/desasignarIdioma',
  async ({ userId, idiomaId }: { userId: number; idiomaId: number }, { rejectWithValue }) => {
    try {
      await usuarioRepo.desasignarIdioma(userId, idiomaId);
      return { userId, idiomaId };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const actualizarTodosIdiomasUsuario = createAsyncThunk(
  'usuarios/actualizarTodosIdiomas',
  async ({ userId, idiomasIds }: { userId: number; idiomasIds: number[] }, { rejectWithValue }) => {
    try {
      await usuarioRepo.actualizarTodosIdiomas(userId, idiomasIds);
      return { userId, idiomasIds };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    clearUsuarioSeleccionado: (state) => {
      state.usuarioSeleccionado = null;
    },
    clearUsuarioError: (state) => {
      state.error = null;
    },
    clearUsuarioIdiomas: (state) => {
      state.usuarioIdiomas = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action: PayloadAction<Usuario[]>) => {
        state.usuarios = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by ID
      .addCase(fetchUsuarioPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarioPorId.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.usuarioSeleccionado = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsuarioPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by Rol
      .addCase(fetchUsuariosPorRol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuariosPorRol.fulfilled, (state, action: PayloadAction<Usuario[]>) => {
        state.usuarios = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsuariosPorRol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Create
      .addCase(createUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUsuario.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Update
      .addCase(updateUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        const index = state.usuarios.findIndex(u => u.id_usuario === action.payload.id_usuario);
        if (index !== -1) {
          state.usuarios[index] = action.payload;
        }
        state.usuarioSeleccionado = action.payload;
        state.loading = false;
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Delete
      .addCase(deleteUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsuario.fulfilled, (state, action: PayloadAction<number>) => {
        state.usuarios = state.usuarios.filter(u => u.id_usuario !== action.payload);
        if (state.usuarioSeleccionado?.id_usuario === action.payload) {
          state.usuarioSeleccionado = null;
        }
        state.loading = false;
      })
      .addCase(deleteUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })

      // NUEVOS CASOS PARA IDIOMAS
      // Fetch usuario idiomas
      .addCase(fetchUsuarioIdiomas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarioIdiomas.fulfilled, (state, action: PayloadAction<UsuarioIdioma[]>) => {
        state.usuarioIdiomas = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsuarioIdiomas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })

      // Asignar idioma
      .addCase(asignarIdiomaUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarIdiomaUsuario.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(asignarIdiomaUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })

      // Desasignar idioma
      .addCase(desasignarIdiomaUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(desasignarIdiomaUsuario.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(desasignarIdiomaUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })

      // Actualizar todos los idiomas
      .addCase(actualizarTodosIdiomasUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarTodosIdiomasUsuario.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(actualizarTodosIdiomasUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

export const { clearUsuarioSeleccionado, clearUsuarioError, clearUsuarioIdiomas } = usuarioSlice.actions;
export default usuarioSlice.reducer;