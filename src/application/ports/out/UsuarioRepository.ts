 
import { Usuario, NuevoUsuarioRequest, UsuarioActualizacionRequest } from '../../../domain/entities/Usuario';

export interface UsuarioRepository {
  obtenerTodos(): Promise<Usuario[]>;
  obtenerPorId(id: number): Promise<Usuario>;
  obtenerPorRol(rol: string): Promise<Usuario[]>;
  crear(usuario: NuevoUsuarioRequest): Promise<number>;
  actualizar(id: number, usuario: UsuarioActualizacionRequest): Promise<void>;
  eliminar(id: number): Promise<void>;
  restaurar(id: number): Promise<void>;
}