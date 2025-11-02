/**
 * src/services/UsuarioService.ts
 * Service para operacoes de usuário
 */

import type { IUsuarioService } from './interfaces/IUsuarioService'
import type { IUsuarioRepository } from '../repositories/interfaces/IUsuarioRepository'
import type { Usuario } from '../database/models/Usuario'
import type { UsuarioCreationAttributes } from '../database/models/Usuario'

export class UsuarioService implements IUsuarioService {
  private usuarioRepository: IUsuarioRepository

  constructor(usuarioRepository: IUsuarioRepository) {
    this.usuarioRepository = usuarioRepository
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(email)
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findById(id)
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll()
  }

  async criarUsuario(usuarioData: UsuarioCreationAttributes): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.findByEmail(usuarioData.email)

    if (usuarioExistente) {
      throw new Error('Usuário já existe com este email')
    }
    return await this.usuarioRepository.create(usuarioData)
  }

  async atualizarUsuario(id: number, usuarioData: Partial<UsuarioCreationAttributes>): Promise<Usuario> {
    // Verifica se usuário existe
    const usuarioExistente = await this.usuarioRepository.findById(id)
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado')
    }

    // Se estiver tentando atualizar email, verifica se não pertence a outro usuário
    if (usuarioData.email && usuarioData.email !== usuarioExistente.email) {
      const usuarioComEmail = await this.usuarioRepository.findByEmail(usuarioData.email)
      if (usuarioComEmail && usuarioComEmail.id !== id) {
        throw new Error('Email já está em uso por outro usuário')
      }
    }

    const usuarioAtualizado = await this.usuarioRepository.update(id, usuarioData)

    if (!usuarioAtualizado) {
      throw new Error('Erro ao atualizar usuário')
    }

    return usuarioAtualizado
  }

  async deletarUsuario(id: number): Promise<boolean> {
    const usuarioExistente = await this.usuarioRepository.findById(id)

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado')
    }

    return await this.usuarioRepository.delete(id)
  }
}

export default UsuarioService
