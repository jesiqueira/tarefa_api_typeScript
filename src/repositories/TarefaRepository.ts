import { Tarefa } from '../database/models/Tarefa'
import type { TarefaCreationAttributes } from '../database/models/Tarefa'
import type { ModelStatic } from 'sequelize'
import type { ITarefaRepository } from './interfaces/ITarefaRepository'

export class TarefaRepository implements ITarefaRepository {
  private model: ModelStatic<Tarefa>

  /**
   * Construtor para Injeção de Dependência
   * @param model - Model do Sequelize (padrão: Tarefa)
   */
  constructor(model: ModelStatic<Tarefa> = Tarefa) {
    this.model = model
  }

  async findById(id: number): Promise<Tarefa | null> {
    return await this.model.findByPk(id)
  }

  async findByUsuarioId(usuarioId: number): Promise<Tarefa[]> {
    return await this.model.findAll({ where: { usuarioId } })
  }

  async findByStatus(status: string): Promise<Tarefa[]> {
    throw new Error('Method not implemented.')
  }

  async findAll(): Promise<Tarefa[]> {
    throw new Error('Method not implemented.')
  }

  async create(tarefaData: TarefaCreationAttributes): Promise<Tarefa> {
    throw new Error('Method not implemented.')
  }

  async update(id: number, tarefaData: Partial<TarefaCreationAttributes>): Promise<Tarefa | null> {
    throw new Error('Method not implemented.')
  }

  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}

// Exporta uma instância padrão para uso normal
export default new TarefaRepository()
