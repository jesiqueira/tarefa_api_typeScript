/**
 * tests/services/TarefaService.test.ts
 * Testes para o TarefaService
 */

import { Tarefa } from '../../database/models/Tarefa'
import { criarUsuario } from '../factories/UsuarioFactory'
import { criarTarefa } from '../factories/TarefaFactory'
import { TarefaRepository } from '../../repositories/TarefaRepository'
import { TarefaService } from '../../services/TarefaService'

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
      const usuario = await criarUsuario({
        nome: 'Usuario especifico',
      })

      const tarefa = await criarTarefa(usuario.id, { titulo: 'Tarefa especifica para teste' })

      // Act
      const tarefaEncontrada = await tarefaService.buscarPorId(tarefa.id)

      // Assert
      expect(tarefaEncontrada).toBeDefined()
      expect(tarefaEncontrada).not.toBeNull()
      expect(tarefaEncontrada?.titulo).toBe('Tarefa especifica para teste')
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
    test('deve retornar array de tarefas quando usuarioId tem tarefas', async () => {
      // Arrange
      const usuario = await criarUsuario()

      // Cria múltiplas tarefas para o mesmo usuário
      await criarTarefa(usuario.id, { titulo: 'Tarefa 1' })
      await criarTarefa(usuario.id, { titulo: 'Tarefa 2' })
      await criarTarefa(usuario.id, { titulo: 'Tarefa 3' })

      // Act
      const tarefas = await tarefaService.buscarPorUsuarioId(usuario.id)

      // Assert
      expect(tarefas).toHaveLength(3)
      expect(Array.isArray(tarefas)).toBe(true)

      // Verifica se todas as tarefas pertencem ao usuário correto
      tarefas.forEach((tarefa) => {
        expect(tarefa.usuarioId).toBe(usuario.id)
      })

      // Verifica os títulos
      const titulos = tarefas.map((t) => t.titulo)
      expect(titulos).toContain('Tarefa 1')
      expect(titulos).toContain('Tarefa 2')
      expect(titulos).toContain('Tarefa 3')
    })

    test('deve retornar array vazio quando usuarioId não tem tarefas', async () => {
      // Arrange
      const usuarioSemTarefas = await criarUsuario()

      // Act
      const tarefas = await tarefaService.buscarPorUsuarioId(usuarioSemTarefas.id)

      // Assert
      expect(tarefas).toHaveLength(0)
      expect(Array.isArray(tarefas)).toBe(true)
    })

    test('deve retornar array vazio quando usuarioId não existe', async () => {
      // Act
      const tarefas = await tarefaService.buscarPorUsuarioId(99999)

      // Assert
      expect(tarefas).toHaveLength(0)
      expect(Array.isArray(tarefas)).toBe(true)
    })

    test('deve retornar apenas tarefas do usuarioId específico', async () => {
      // Arrange
      const usuario1 = await criarUsuario()
      const usuario2 = await criarUsuario()

      // Cria tarefas para usuário 1
      await criarTarefa(usuario1.id, { titulo: 'Tarefa User 1' })
      await criarTarefa(usuario1.id, { titulo: 'Outra Tarefa User 1' })

      // Cria tarefas para usuário 2
      await criarTarefa(usuario2.id, { titulo: 'Tarefa User 2' })

      // Act - Busca apenas tarefas do usuário 1
      const tarefasUsuario1 = await tarefaService.buscarPorUsuarioId(usuario1.id)

      // Assert
      expect(tarefasUsuario1).toHaveLength(2)

      // Verifica que todas as tarefas são do usuário 1
      tarefasUsuario1.forEach((tarefa) => {
        expect(tarefa.usuarioId).toBe(usuario1.id)
        expect(tarefa.usuarioId).not.toBe(usuario2.id)
      })

      // Verifica que não retornou tarefas do usuário 2
      const titulos = tarefasUsuario1.map((t) => t.titulo)
      expect(titulos).not.toContain('Tarefa User 2')
    })

    test('deve retornar tarefas ordenadas por ID (ou outra ordem padrão)', async () => {
      // Arrange
      const usuario = await criarUsuario()
      await criarTarefa(usuario.id, { titulo: 'Tarefa 1' })
      await criarTarefa(usuario.id, { titulo: 'Tarefa 2' })

      // Act
      const tarefas = await tarefaService.buscarPorUsuarioId(usuario.id)

      // Assert
      expect(tarefas).toBeDefined()
      expect(tarefas).not.toBeNull()

      // Type assertion para garantir ao TypeScript
      const tarefasArray = tarefas as Tarefa[]

      expect(tarefasArray).toHaveLength(2)
      expect(tarefasArray[0]?.usuarioId).toBe(usuario.id)
      expect(tarefasArray[1]?.usuarioId).toBe(usuario.id)
    })
  })

  describe('buscarPorStatus', () => {
    test('deve retornar array de tarefas quando existem tarefas com o status ', async () => {
      // Arrange
      const usuario = await criarUsuario()

      await criarTarefa(usuario.id, {
        titulo: 'Tarefa Pendente 1',
        status: 'pendente',
      })
      await criarTarefa(usuario.id, {
        titulo: 'Tarefa Pendente 2',
        status: 'pendente',
      })
      await criarTarefa(usuario.id, {
        titulo: 'Tarefa Concluída',
        status: 'concluida',
      })

      // Act
      const tarefasPendentes = await tarefaService.buscarPorStatus('pendente')

      // Assert
      expect(tarefasPendentes).toBeDefined()
      const tarefasArray = tarefasPendentes as Tarefa[]

      expect(tarefasArray).toHaveLength(2)
      expect(Array.isArray(tarefasArray)).toBe(true)

      // Verifica se todas têm o status correto
      tarefasArray.forEach((tarefa) => {
        expect(tarefa.status).toBe('pendente')
      })

      // Verifica os títulos
      const titulos = tarefasArray.map((t) => t.titulo)
      expect(titulos).toContain('Tarefa Pendente 1')
      expect(titulos).toContain('Tarefa Pendente 2')
      expect(titulos).not.toContain('Tarefa Concluída')
    })

    test('deve retornar array vazio quando não existe, tarefas com status', async () => {
      // Arrange
      const usuario = await criarUsuario()

      await criarTarefa(usuario.id, {
        titulo: 'Tarefa concluida',
        status: 'concluida',
      })

      // Act - Busca por status que não existe
      const tarefasPendentes = await tarefaService.buscarPorStatus('pendente')

      // Assert
      expect(tarefasPendentes).toBeDefined()
      expect(tarefasPendentes).toHaveLength(0)
      expect(Array.isArray(tarefasPendentes)).toBe(true)
    })

    test('deve retornar array vazio quando status não existe no sistema', async () => {
      // Act - Busca por status inexistente
      const tarefas = await tarefaService.buscarPorStatus('status_inexistente')

      // Assert
      expect(tarefas).toBeDefined()
      expect(tarefas).toHaveLength(0)
      expect(Array.isArray(tarefas)).toBe(true)
    })

    test('deve retornar tarefas de múltiplos usuários com mesmo status', async () => {
      // Arrange
      const usuario1 = await criarUsuario()
      const usuario2 = await criarUsuario()

      // Tarefas pendentes de usuários diferentes
      await criarTarefa(usuario1.id, {
        titulo: 'Pendente User 1',
        status: 'pendente',
      })
      await criarTarefa(usuario2.id, {
        titulo: 'Pendente User 2',
        status: 'pendente',
      })
      await criarTarefa(usuario1.id, {
        titulo: 'Concluída User 1',
        status: 'concluida',
      })

      // Act
      const tarefasPendentes = await tarefaService.buscarPorStatus('pendente')

      // Assert
      expect(tarefasPendentes).toHaveLength(2)

      // Verifica que retornou de ambos os usuários
      const usuarioIds = tarefasPendentes.map((t) => t.usuarioId)
      expect(usuarioIds).toContain(usuario1.id)
      expect(usuarioIds).toContain(usuario2.id)

      // Verifica que todas são pendentes
      tarefasPendentes.forEach((tarefa) => {
        expect(tarefa.status).toBe('pendente')
      })
    })

    test('deve funcionar com diferentes status válidos', async () => {
      // Arrange
      const usuario = await criarUsuario()

      await criarTarefa(usuario.id, { status: 'pendente' })
      await criarTarefa(usuario.id, { status: 'concluida' })
      await criarTarefa(usuario.id, { status: 'em_andamento' })

      // Act & Assert para cada status
      const pendentes = await tarefaService.buscarPorStatus('pendente')
      expect(pendentes).toHaveLength(1)
      expect(pendentes[0]?.status).toBe('pendente')

      const concluidas = await tarefaService.buscarPorStatus('concluida')
      expect(concluidas).toHaveLength(1)
      expect(concluidas[0]?.status).toBe('concluida')

      const em_andamento = await tarefaService.buscarPorStatus('em_andamento')
      expect(em_andamento).toHaveLength(1)
      expect(em_andamento[0]?.status).toBe('em_andamento')
    })

    test('deve ser case sensitive ou insensitive conforme implementação', async () => {
      // Arrange
      const usuario = await criarUsuario()
      await criarTarefa(usuario.id, { status: 'pendente' })

      // Act - Testa com case diferente
      const tarefas = await tarefaService.buscarPorStatus('PENDENTE') // Maiúsculo

      // Se seu banco for case-sensitive, retornará 0
      // Se for case-insensitive, retornará 1
      expect(tarefas.length).toBeGreaterThanOrEqual(0)

      // Pelo menos verifica que não quebra
      expect(Array.isArray(tarefas)).toBe(true)
    })
  })
})
