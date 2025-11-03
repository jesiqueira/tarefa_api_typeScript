/**
 * src/services/interfaces/ITarefaService.ts
 * Interface para o TarefaService
 */

import type { Tarefa } from '../../database/models/Tarefa'
import type { TarefaCreationAttributes } from '../../database/models/Tarefa'

export interface ITarefaService {
  /**
   * Buscar Tarefa por ID
   * @param id
   */
  buscarPorId(id: number): Promise<Tarefa | null>

  /**
   * Buscar Tarefas por usuarioId
   * @param usuarioId
   */
  buscarPorUsuarioId(usuarioId: number): Promise<Tarefa[]>

  /**
   * Buscar por status da Tarefa
   * @param status
   */
  buscarPorStatus(status: string): Promise<Tarefa[]>

  /**
   * Listar todas as Tarefas
   */
  listarTarefas(): Promise<Tarefa[]>

  /**
   * Criar uma Tarefa
   */
  criarTarefa(tarefaData: TarefaCreationAttributes): Promise<Tarefa>

  /**
   * Atualizar Tarefa existente
   * @param id
   * @param tarefaData
   */
  atualizarTarefa(id: number, tarefaData: Partial<TarefaCreationAttributes>): Promise<Tarefa | null>

  /**
   * Deletar uma tarefa
   * @param id
   */
  deletarTarefa(id: number): Promise<boolean>
}
