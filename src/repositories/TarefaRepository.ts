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
    return await this.model.findAll({ where: { status } })
  }

  async findAll(): Promise<Tarefa[]> {
    return await this.model.findAll()
  }

  async create(tarefaData: TarefaCreationAttributes): Promise<Tarefa> {
    return await this.model.create(tarefaData)
  }

  async update(id: number, tarefaData: Partial<TarefaCreationAttributes>): Promise<Tarefa | null> {
    const tarefa = await this.findById(id)

    if (!tarefa) {
      return null
    }

    return await tarefa.update(tarefaData)
  }

  async delete(id: number): Promise<boolean> {
    const tarefa = await this.findById(id)

    if (!tarefa) {
      return false
    }

    await tarefa.destroy()
    return true
  }
}

// Exporta uma instância padrão para uso normal
export default new TarefaRepository()
