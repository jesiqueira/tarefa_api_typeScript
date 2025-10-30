/**
 * src/__tests__/repositories/TarefaRepository.test.ts
 * Testes para o TarefaRepository
 */
import { Tarefa } from '../../database/models/Tarefa'
import { TarefaRepository } from '../../repositories/TarefaRepository'
import type { ITarefaRepository } from '../../repositories/interfaces/ITarefaRepository'
import type { TarefaCreationAttributes } from '../../database/models/Tarefa'
import { Usuario } from '../../database/models/Usuario'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

// ----------------------------------------------------------------------
// TIPOS PARA TESTES - TYPE SAFE
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
type TarefaComStatusCustom = TarefaCreationTest & { status: 'pendente' | 'em_andamento' | 'concluida' }

// ----------------------------------------------------------------------
// TESTES
// ----------------------------------------------------------------------

describe('TarefaRepository', () => {
  let tarefaRepository: ITarefaRepository
  let usuario: Usuario

  beforeAll(async () => {
    tarefaRepository = new TarefaRepository()

    // Cria um usuário para os testes
    const usuarioData: UsuarioCreationAttributes = {
      nome: 'Usuário para Tarefas',
      email: 'usuario.tarefas@email.com',
      passwordHash: 'hash_usuario',
    }
    usuario = await Usuario.create(usuarioData)

    // ✅ ADICIONE UMA PAUSA para evitar conflitos de FK no SQLite
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  // --------------------------------------------------------------------
  // TESTES DE BUSCA
  // --------------------------------------------------------------------
  describe('métodos de busca', () => {
    describe('findById', () => {
      // test('deve retornar tarefa quando ID existe', async () => {
      //   // 🟢 ARRANGE
      //   const tarefaCriada = await Tarefa.create({
      //     titulo: 'Tarefa para Buscar por ID',
      //     usuarioId: usuario.id,
      //   })

      //   // ✅ PEQUENA PAUSA para o SQLite processar
      //   await new Promise((resolve) => setTimeout(resolve, 10))

      //   // 🔵 ACT
      //   const tarefaEncontrada = await tarefaRepository.findById(tarefaCriada.id)

      //   // 🟣 ASSERT
      //   expect(tarefaEncontrada).toBeDefined()
      //   expect(tarefaEncontrada).not.toBeNull()

      //   if (tarefaEncontrada) {
      //     expect(tarefaEncontrada.id).toBe(tarefaCriada.id)
      //     expect(tarefaEncontrada.titulo).toBe('Tarefa para Buscar por ID')
      //     expect(tarefaEncontrada.usuarioId).toBe(usuario.id)
      //   }
      // })

      test('deve retornar null quando ID não existe', async () => {
        // 🔵 ACT & 🟣 ASSERT
        const tarefaEncontrada = await tarefaRepository.findById(99999)
        expect(tarefaEncontrada).toBeNull()
      })
    })
  })
})
