/**
 * src/services/interfaces/IUsuarioService.ts
 * Interface para o UsuarioService
 */

import type { Usuario } from '../../database/models/Usuario'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

export interface IUsuarioService {
  /**
   * Buscar usuario por email
   */
  buscarPorEmail(email: string): Promise<Usuario | null>

  /**
   * Buscar usuário por ID
   */
  buscarPorId(id: number): Promise<Usuario | null>

  /**
   *Listar todos os usuários
   */
  listarUsuarios(): Promise<Usuario[]>

  /**
   * Criar um novo usuário
   */
  criarUsuario(usuarioData: UsuarioCreationAttributes): Promise<Usuario>

  /**
   * Realizar login
   */
  login(dados: { email: string; senha: string }): Promise<{ usuario: Usuario; token: string }>

  /**
   * Atualizar um usuário existente
   */
  atualizarUsuario(id: number, usuarioData: Partial<UsuarioCreationAttributes>): Promise<Usuario>

  /**
   * Deletar um usuário
   */
  deletarUsuario(id: number): Promise<boolean>
}
