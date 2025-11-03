/**
 * src/services/TarefaService.ts
 * Service para operacoes de Tarefa
 */

import type { ITarefaService } from './interfaces/ITarefaService'
import type { ITarefaRepository } from '../repositories/interfaces/ITarefaRepository'
import type Tarefa from '../database/models/Tarefa'
import type { TarefaCreationAttributes } from '../database/models/Tarefa'

export class TarefaService implements ITarefaService {
  private tarefaRepository: ITarefaRepository

  constructor(tarefaRepository: ITarefaRepository) {
    this.tarefaRepository = tarefaRepository
  }

  async buscarPorId(id: number): Promise<Tarefa | null> {
    return await this.tarefaRepository.findById(id)
  }

  async buscarPorUsuarioId(usuarioId: number): Promise<Tarefa[]> {
    return await this.tarefaRepository.findByUsuarioId(usuarioId)
  }

  async buscarPorStatus(status: string): Promise<Tarefa[]> {
    return await this.tarefaRepository.findByStatus(status)
  }

  async listarTarefas(): Promise<Tarefa[]> {
    throw new Error('Method not implemented.')
  }

  async criarTarefa(tarefaData: TarefaCreationAttributes): Promise<Tarefa> {
    throw new Error('Method not implemented.')
  }

  async atualizarTarefa(id: number, tarefaData: Partial<TarefaCreationAttributes>): Promise<Tarefa | null> {
    throw new Error('Method not implemented.')
  }

  async deletarTarefa(id: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
