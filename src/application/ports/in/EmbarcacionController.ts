import { Embarcacion, EmbarcacionCreacion, EmbarcacionActualizacion } from '../../../domain/entities/Embarcacion';

export interface EmbarcacionController {
  listar(): Promise<Embarcacion[]>;
  listarPorSede(idSede: number): Promise<Embarcacion[]>;
  listarPorChofer(idChofer: number): Promise<Embarcacion[]>;
  obtenerPorId(id: number): Promise<Embarcacion | null>;
  crear(embarcacion: EmbarcacionCreacion): Promise<Embarcacion>;
  actualizar(id: number, embarcacion: EmbarcacionActualizacion): Promise<Embarcacion>;
  eliminar(id: number): Promise<boolean>;
}