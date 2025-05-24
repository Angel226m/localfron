 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UsuarioRepoHttp } from '../../repositories/UsuarioRepoHttp';
import { Usuario, NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../domain/entities/Usuario';
import { ListarUsuarios } from '../../../application/use-cases/usuario/ListarUsuarios';
import { ObtenerUsuarioPorId } from '../../../application/use-cases/usuario/ObtenerUsuarioPorId';
import { CrearUsuario } from '../../../application/use-cases/usuario/CrearUsuario';
import { ActualizarUsuario } from '../../../application/use-cases/usuario/ActualizarUsuario';
import { EliminarUsuario } from '../../../application/use-cases/usuario/EliminarUsuario';

// Repositorio
const usuarioRepo = new UsuarioRepoHttp();

// Casos de uso
const listarUsuariosUseCase = new ListarUsuarios(usuarioRepo);
const obtenerUsuarioPorIdUseCase = new ObtenerUsuarioPorId(usuarioRepo);
const crearUsuarioUseCase = new CrearUsuario(usuarioRepo);
const actualizarUsuarioUseCase = new ActualizarUsuario(usuarioRepo);
const eliminarUsuarioUseCase = new EliminarUsuario(usuarioRepo);

// Estado inicial
interface UsuarioState {
  usuarios: Usuario[];
  usuarioSeleccionado: Usuario | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  usuarioSeleccionado: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchUsuarios = createAsyncThunk(
  'usuario/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await listarUsuariosUseCase.execute();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuarios');
    }
  }
);

export const fetchUsuariosPorRol = createAsyncThunk(
  'usuario/fetchByRol',
  async (rol: string, { rejectWithValue }) => {
    try {
      const response = await usuarioRepo.getByRol(rol);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuarios por rol');
    }
  }
);

export const fetchUsuarioPorId = createAsyncThunk(
  'usuario/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await obtenerUsuarioPorIdUseCase.execute(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuario');
    }
  }
);

export const createUsuario = createAsyncThunk(
  'usuario/create',
  async (usuario: NuevoUsuarioRequest, { rejectWithValue }) => {
    try {
      const id = await crearUsuarioUseCase.execute(usuario);
      return { id, ...usuario };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear usuario');
    }
  }
);

export const updateUsuario = createAsyncThunk(
  'usuario/update',
  async ({ id, usuario }: { id: number; usuario: ActualizarUsuarioRequest }, { rejectWithValue }) => {
    try {
      await actualizarUsuarioUseCase.execute(id, usuario);
      return { id, ...usuario };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
);

export const deleteUsuario = createAsyncThunk(
  'usuario/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await eliminarUsuarioUseCase.execute(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }
);

// Slice
const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    clearUsuarioError: (state) => {
      state.error = null;
    },
    clearUsuarioSeleccionado: (state) => {
      state.usuarioSeleccionado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Usuarios
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action: PayloadAction<Usuario[]>) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Usuarios por Rol
      .addCase(fetchUsuariosPorRol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuariosPorRol.fulfilled, (state, action: PayloadAction<Usuario[]>) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuariosPorRol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Usuario por ID
      .addCase(fetchUsuarioPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarioPorId.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.usuarioSeleccionado = action.payload;
      })
      .addCase(fetchUsuarioPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Usuario
      .addCase(createUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUsuario.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Usuario
      .addCase(updateUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsuario.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Usuario
      .addCase(deleteUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsuario.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.usuarios = state.usuarios.filter(usuario => usuario.id_usuario !== action.payload);
      })
      .addCase(deleteUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsuarioError, clearUsuarioSeleccionado } = usuarioSlice.actions;
export default usuarioSlice.reducer;