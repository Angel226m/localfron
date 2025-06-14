import { Cliente } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ObtenerClientePorId {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(id: number): Promise<Cliente> {
    return await this.clienteRepository.findById(id);
  }
}