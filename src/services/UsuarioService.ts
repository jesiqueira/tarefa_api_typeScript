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
    return await this.usuarioRepository.create(usuarioData)
  }
  async atualizarUsuario(id: number, usuarioData: Partial<UsuarioCreationAttributes>): Promise<Usuario | null> {
    const usuario = await this.buscarPorId(id)

    if (!usuario) {
      return null
    }

    return await usuario.update(usuarioData)
  }
  async deletarUsuario(id: number): Promise<boolean> {
    const usuario = await this.buscarPorId(id)

    if (!usuario) {
      return false
    }

    await usuario.destroy()
    return true
  }
}

export default UsuarioService
