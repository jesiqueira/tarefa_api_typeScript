import { Usuario } from '../database/models/Usuario'
import type { UsuarioCreationAttributes } from '../database/models/Usuario'

export const criarUsuario = async (overrides?: Partial<UsuarioCreationAttributes>): Promise<Usuario> => {
  return await Usuario.create({
    nome: 'Usuario Teste',
    email: `usuario${Date.now()}@email.com`, // Email único
    passwordHash: 'hash_segura',
    ...overrides,
  })
}
