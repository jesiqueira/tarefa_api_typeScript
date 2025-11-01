/**
 * tests/services/UsuarioService.test.ts
 * Testes para o UsuarioService
 */

import { Usuario } from '../../database/models/Usuario'
import { UsuarioRepository } from '../../repositories/UsuarioRepository'
import { UsuarioService } from '../../services/UsuarioService'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

describe('UsuariosService', () => {
  let usuarioService: UsuarioService
  let usuarioRepository: UsuarioRepository

  // Executa antes de cada teste
  beforeEach(async () => {
    usuarioRepository = new UsuarioRepository(Usuario)
    usuarioService = new UsuarioService(usuarioRepository)
  })

  // --------------------------------------------------------------------
  // DESCRIBE ANINHADO: Métodos de Busca
  // --------------------------------------------------------------------
  describe('buscaPorEmail', () => {
    test('deve retorna um usuario quando email existe', async () => {
      // Arrange
      const email = 'teste@email.com'
      await Usuario.create({
        nome: 'Usuario Teste',
        email,
        passwordHash: 'hash123',
      })

      // Act
      const usuarioEncontrado = await usuarioService.buscarPorEmail(email)

      // Assert
      expect(usuarioEncontrado).toBeDefined()
      expect(usuarioEncontrado).not.toBeNull()
      expect(usuarioEncontrado?.email).toBe(email)
      expect(usuarioEncontrado?.nome).toBe('Usuario Teste')
    })

    test('deve retornar null quando email não existe', async () => {
      // Act
      const usuarioEncontrado = await usuarioService.buscarPorEmail('naoexiste@email.com')

      // Assert
      expect(usuarioEncontrado).toBeNull()
    })
  })

  describe('buscarPorId', () => {
    test('deve retornar um usuario quando ID existe', async () => {
      // Arrange
      const usuarioCriado = await Usuario.create({
        nome: 'Usuario para buscar por ID',
        email: 'buscaid@email.com',
        passwordHash: 'hush_busca',
      })

      // Act
      const usuarioEncontrado = await usuarioService.buscarPorId(usuarioCriado.id)

      // Assert
      expect(usuarioEncontrado).toBeDefined()
      expect(usuarioEncontrado?.id).toBe(usuarioCriado.id)
      expect(usuarioEncontrado?.nome).toBe(usuarioCriado.nome)
      expect(usuarioEncontrado?.passwordHash).toBe(usuarioCriado.passwordHash)
    })

    test('deve retorna null quando ID não existir', async () => {
      // Act
      const usuarioEncontrado = await usuarioService.buscarPorId(99999)

      // Assert
      expect(usuarioEncontrado).toBeNull()
    })
  })

  describe('listaUsuarios', () => {
    test('deve retornar array vaxio quando não existir usuário', async () => {
      // Act
      const usuario = await usuarioService.listarUsuarios()

      // Assert
      expect(usuario).toEqual([])
      expect(usuario).toHaveLength(0)
    })

    test('deve retornar todos os usuários', async () => {
      // Arrange
      await Usuario.bulkCreate([
        {
          nome: 'Usuário 1',
          email: 'user1@email.com',
          passwordHash: 'hash1',
        },
        {
          nome: 'Usuário 2',
          email: 'user2@email.com',
          passwordHash: 'hash2',
        },
      ])

      // Act
      const usuarios = await usuarioService.listarUsuarios()

      // Assert
      expect(usuarios).toHaveLength(2)
      expect(usuarios[0]?.email).toBe('user1@email.com')
      expect(usuarios[1]?.email).toBe('user2@email.com')
    })
  })

  // --------------------------------------------------------------------
  // DESCRIBE ANINHADO: Métodos de Escrita
  // --------------------------------------------------------------------
  describe('métodos de escrita', () => {
    describe('criarUsuario', () => {
      test('deve criar um usuario com dados válidos', async () => {
        // Arrange
        const usuarioData: UsuarioCreationAttributes = {
          nome: 'Novo Usuário',
          email: 'novo@email.com',
          passwordHash: 'novo_hash',
        }

        // Act
        const usuarioCriado = await usuarioService.criarUsuario(usuarioData)

        // Assert
        expect(usuarioCriado).toBeDefined()

        if (usuarioCriado) {
          expect(usuarioCriado.id).toBeDefined()
          expect(usuarioCriado.nome).toBe(usuarioData.nome)
          expect(usuarioCriado.email).toBe(usuarioData.email)
          expect(usuarioCriado.passwordHash).toBe(usuarioData.passwordHash)
        }
      })

      test('deve lancar erro ao criar usuario com e-mail duplicado', async () => {
        // Arrange
        const email = 'duplicado@email.com'

        const usuarioData: UsuarioCreationAttributes = {
          nome: 'Primeiro Usuario',
          email,
          passwordHash: 'hash1',
        }

        // Criar o primeiro usuario
        await usuarioService.criarUsuario(usuarioData)

        // Act & Assert - Tenta criar segundo usuário com mesmo email
        await expect(
          usuarioService.criarUsuario({
            nome: 'Segundo Usuario',
            email,
            passwordHash: 'hash2',
          }),
        ).rejects.toThrow()
      })

      test('deve criar usuario com campos mínimos obrigatórios', async () => {
        // Arrange
        const usuarioMinimo: UsuarioCreationAttributes = {
          nome: 'Mínimo',
          email: 'minimo@email.com',
          passwordHash: 'hash_minimo',
        }

        // Act
        const usuarioCriado = await usuarioService.criarUsuario(usuarioMinimo)

        // Assert
        expect(usuarioCriado.id).toBeDefined()
        expect(usuarioCriado.nome).toBe('Mínimo')
        expect(usuarioCriado.email).toBe('minimo@email.com')
      })
    })

    describe('atualizarUsuario', () => {
      test('deve atualizar usuário existente', async () => {
        //Arrange
        const usuario = await Usuario.create({
          nome: 'Nome Original',
          email: 'original@email.com',
          passwordHash: 'hash_original',
        })

        // Act
        const usuarioAtualizado = await usuarioService.atualizarUsuario(usuario.id, {
          nome: 'Nome atualizado',
        })

        // Assert
        expect(usuarioAtualizado).toBeDefined()
        expect(usuarioAtualizado?.nome).toBe('Nome atualizado')
        expect(usuarioAtualizado?.email).toBe('original@email.com')
      })
    })
  })
})
