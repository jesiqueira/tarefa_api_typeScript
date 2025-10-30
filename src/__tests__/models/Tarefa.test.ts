/**
 * src/__tests__/models/Tarefa.test.ts
 * Testes para o model Tarefa com tipos type-safe
 */

import { Tarefa, TAREFA_TABLE_NAME, TAREFA_STATUS_VALUES } from '../../database/models/Tarefa'
import { Usuario } from '../../database/models/Usuario'
import type { TarefaCreationAttributes } from '../../database/models/Tarefa'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

// ----------------------------------------------------------------------
// TIPOS PARA TESTES DO MODEL - TYPE SAFE
// ----------------------------------------------------------------------

// Tipo para criação de tarefa com campos opcionais para testes
type TarefaCreationTest = Partial<TarefaCreationAttributes> & {
  titulo?: string
  descricao?: string | null
  status?: 'pendente' | 'em_andamento' | 'concluida'
  usuarioId?: number
}

// Tipos específicos para cada cenário de validação
type TarefaSemTitulo = Omit<TarefaCreationTest, 'titulo'> & { titulo?: never }
type TarefaSemUsuarioId = Omit<TarefaCreationTest, 'usuarioId'> & { usuarioId?: never }
type TarefaSemDescricao = Omit<TarefaCreationTest, 'descricao'> & { descricao?: never }
type TarefaComStatusCustom = TarefaCreationTest & { status: 'pendente' | 'em_andamento' | 'concluida' }

// ----------------------------------------------------------------------
// TESTES
// ----------------------------------------------------------------------

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
    test('deve ter o nome da tabela correto', () => {
      expect(Tarefa.getTableName()).toBe(TAREFA_TABLE_NAME)
    })

    test('deve ter todos os campos definidos', () => {
      const attributes = Tarefa.getAttributes()

      expect(attributes).toHaveProperty('id')
      expect(attributes).toHaveProperty('titulo')
      expect(attributes).toHaveProperty('descricao')
      expect(attributes).toHaveProperty('status')
      expect(attributes).toHaveProperty('usuarioId')
    })

    test('deve ter valores válidos para status', () => {
      expect(TAREFA_STATUS_VALUES).toEqual(['pendente', 'em_andamento', 'concluida'])
    })
  })

  // --------------------------------------------------------------------
  // TESTES DE CRIAÇÃO - COM TIPOS TYPE-SAFE
  // --------------------------------------------------------------------

  describe('Criação de Tarefa', () => {
    test('deve criar uma tarefa com dados válidos', async () => {
      // 🟢 ARRANGE
      const tarefaData: TarefaCreationAttributes = {
        titulo: 'Minha Primeira Tarefa',
        descricao: 'Descrição da tarefa',
        status: 'pendente',
        usuarioId: usuario.id,
      }

      // 🔵 ACT
      const tarefa = await Tarefa.create(tarefaData)

      // 🟣 ASSERT
      expect(tarefa.id).toBeDefined()
      expect(tarefa.titulo).toBe(tarefaData.titulo)
      expect(tarefa.descricao).toBe(tarefaData.descricao)
      expect(tarefa.status).toBe(tarefaData.status)
      expect(tarefa.usuarioId).toBe(usuario.id)
    })

    test('deve criar tarefa com status padrão "pendente"', async () => {
      // 🟢 ARRANGE - Não passa status, deve usar default
      const tarefaData: TarefaSemDescricao & { status?: never } = {
        titulo: 'Tarefa com Status Padrão',
        usuarioId: usuario.id,
      }

      // 🔵 ACT
      const tarefa = await Tarefa.create(tarefaData as TarefaCreationAttributes)

      // 🟣 ASSERT
      expect(tarefa.status).toBe('pendente')
    })

    test('deve criar tarefa sem descrição', async () => {
      // 🟢 ARRANGE - Usando tipo sem descrição
      const tarefaData: TarefaSemDescricao = {
        titulo: 'Tarefa sem Descrição',
        usuarioId: usuario.id,
      }

      // 🔵 ACT
      const tarefa = await Tarefa.create(tarefaData as TarefaCreationAttributes)

      // 🟣 ASSERT
      expect(tarefa.descricao).toBeUndefined()
    })

    test('deve criar tarefa com descrição null explícita', async () => {
      const tarefaData: TarefaCreationAttributes = {
        titulo: 'Tarefa com Descrição Null',
        descricao: null, // ← Passando null explicitamente
        usuarioId: usuario.id,
      }

      const tarefa = await Tarefa.create(tarefaData)

      // ✅ Quando passamos null explicitamente, deve ser null
      expect(tarefa.descricao).toBeNull()
    })

    test('deve criar tarefa com descrição vazia', async () => {
      const tarefaData: TarefaCreationAttributes = {
        titulo: 'Tarefa com Descrição Vazia',
        descricao: '', // ← String vazia
        usuarioId: usuario.id,
      }

      const tarefa = await Tarefa.create(tarefaData)

      // ✅ Quando passamos string vazia, deve ser string vazia
      expect(tarefa.descricao).toBe('')
    })
  })
})
