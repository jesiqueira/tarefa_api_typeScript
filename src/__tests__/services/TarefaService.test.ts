/**
 * tests/services/TarefaService.test.ts
 * Testes para o TarefaService
 */

import { Tarefa } from '../../database/models/Tarefa'
import { Usuario } from '../../database/models/Usuario'
import { TarefaRepository } from '../../repositories/TarefaRepository'
import { TarefaService } from '../../services/TarefaService'
import type { TarefaCreationAttributes } from '../../database/models/Tarefa'

describe('TarefaService', () => {
  let tarefaService: TarefaService
  let tarefaRepository: TarefaRepository

  beforeEach(async () => {
    tarefaRepository = new TarefaRepository(Tarefa)
    tarefaService = new TarefaService(tarefaRepository)
  })

  // --------------------------------------------------------------------
  // DESCRIBE ANINHADO: Métodos de Busca
  // --------------------------------------------------------------------
  describe('buscarPorId', () => {
    test('deve retornar uma Tarefa quando ID existe', async () => {
      // Arrange
      const usuarioCriado = await Usuario.create({
        nome: 'Usuario criado',
        email: 'usuario@email.com',
        passwordHash: 'hash_usuario',
      })
      const tarefaCriada = await Tarefa.create({
        titulo: 'Tarefa teste',
        descricao: 'Tarefa criada para teste',
        usuarioId: usuarioCriado.id,
      })

      // Act
      const tarefaEncontrada = await tarefaService.buscarPorId(tarefaCriada.id)

      // Assert
      expect(tarefaEncontrada).toBeDefined()
      expect(tarefaEncontrada).not.toBeNull()
      expect(tarefaEncontrada?.titulo).toBe('Tarefa teste')
      expect(tarefaEncontrada?.usuarioId).toBe(1)
    })

    test('deve retornar null quando ID da tarefa nao existir', async () => {
      // Act
      const tarefaEncontrada = await tarefaService.buscarPorId(9999)

      // Assert
      expect(tarefaEncontrada).toBeNull()
    })
  })

  describe('buscarPorUsuarioId', () => {
    test('deve retornar tarefa quando usuarioId existe', async () => {
      //
    })
  })
})
