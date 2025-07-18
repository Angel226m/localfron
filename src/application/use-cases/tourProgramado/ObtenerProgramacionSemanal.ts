import { TourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerProgramacionSemanal {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fechaInicio: string, idSede?: number): Promise<TourProgramado[]> {
    return this.tourProgramadoRepository.obtenerProgramacionSemanal(fechaInicio, idSede);
  }
}