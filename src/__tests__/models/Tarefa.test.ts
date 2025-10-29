/**
 * src/__tests__/models/Tarefa.test.ts
 */

import { Tarefa, TAREFA_TABLE_NAME, TAREFA_STATUS_VALUES } from '../../database/models/Tarefa'
import { Usuario } from '../../database/models/Usuario'
import type { TarefaCreationAttributes } from '../../database/models/Tarefa'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

describe('Tarefa Model', () => {
  let usuario: Usuario

  // Cria um usuário antes de todos os testes de Tarefa
  beforeEach(async () => {
    const usuarioData: UsuarioCreationAttributes = {
      nome: 'Usuário para teste',
      email: 'usuario.tarefa@email.com',
      passwordHash: 'hash_usuario',
    }
    usuario = await Usuario.create(usuarioData)
  })

  // --------------------------------------------------------------------
  // TESTES BÁSICOS
  // --------------------------------------------------------------------
  describe('Definição do Model', () => {
    test('deve ter o nome da tarefa correto', async () => {
      // Assert
      expect(Tarefa.tableName).toBe(TAREFA_TABLE_NAME)
    })

    test('deve ter todos os campos definidos', () => {
      const attritutes = Tarefa.getAttributes()

      expect(attritutes).toHaveProperty('id')
      expect(attritutes).toHaveProperty('titulo')
      expect(attritutes).toHaveProperty('descricao')
      expect(attritutes).toHaveProperty('status')
      expect(attritutes).toHaveProperty('usuario_id')
      expect(attritutes).toHaveProperty('created_At')
      expect(attritutes).toHaveProperty('updated_At')
    })
  })
})
