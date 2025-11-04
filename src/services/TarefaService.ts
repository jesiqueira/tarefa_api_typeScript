/**
 * src/services/TarefaService.ts
 * Service para operacoes de Tarefa
 */

import type { ITarefaService } from './interfaces/ITarefaService'
import type { ITarefaRepository } from '../repositories/interfaces/ITarefaRepository'
import type Tarefa from '../database/models/Tarefa'
import type { TarefaCreationAttributes } from '../database/models/Tarefa'

import { TarefaNaoEncontradaError, TarefaDadosInvalidosError } from '../errors'

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
    const statusNormalizado = status.toLowerCase()
    const statusValidos = ['pendente', 'em_andamento', 'concluida']

    if (!statusValidos.includes(statusNormalizado)) {
      throw new TarefaDadosInvalidosError(`Status inválido: ${status}`)
    }

    return await this.tarefaRepository.findByStatus(statusNormalizado)
  }

  async listarTarefas(): Promise<Tarefa[]> {
    return await this.tarefaRepository.findAll()
  }

  async criarTarefa(tarefaData: TarefaCreationAttributes): Promise<Tarefa> {
    // Validações básicas
    if (!tarefaData.titulo || tarefaData.titulo.trim().length === 0) {
      throw new TarefaDadosInvalidosError('Título é obrigatório')
    }

    if (tarefaData.titulo.length > 255) {
      throw new TarefaDadosInvalidosError('Título muito longo')
    }

    return await this.tarefaRepository.create(tarefaData)
  }

  async atualizarTarefa(id: number, tarefaData: Partial<TarefaCreationAttributes>): Promise<Tarefa> {
    // Verifica se tarefa existe
    const tarefaExistente = await this.tarefaRepository.findById(id)
    if (!tarefaExistente) {
      throw new TarefaNaoEncontradaError()
    }

    // Validações de atualização
    if (tarefaData.titulo !== undefined) {
      if (!tarefaData.titulo || tarefaData.titulo.trim().length === 0) {
        throw new TarefaDadosInvalidosError('Título é obrigatório')
      }

      if (tarefaData.titulo.length > 255) {
        throw new TarefaDadosInvalidosError('Título muito longo')
      }
    }

    const tarefaAtualizada = await this.tarefaRepository.update(id, tarefaData)

    if (!tarefaAtualizada) {
      throw new Error('Erro interno ao atualizar tarefa')
    }

    return tarefaAtualizada
  }

  async deletarTarefa(id: number): Promise<boolean> {
    // Verifica se tarefa existe
    const tarefaExistente = await this.tarefaRepository.findById(id)
    if (!tarefaExistente) {
      throw new TarefaNaoEncontradaError()
    }

    return await this.tarefaRepository.delete(id)
  }
}
