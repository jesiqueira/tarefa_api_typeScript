// src/__tests__/integration/UsuarioController.test.ts
import { Usuario } from '../../database/models/Usuario'
import { UsuarioService } from '../../services/UsuarioService'
import { UsuarioRepository } from '../../repositories/UsuarioRepository'
import { UsuarioController } from '../../controllers/UsuarioController'
import type { IUsuarioController } from '../../controllers/interfaces/IUsuarioController'
import { criarUsuario, criarUsuarioComSenha } from '../../factories/UsuarioFactory'
import { criarMockRequest, criarMockResponse } from '../helpers/httpHelpers'

describe('UsuarioController', () => {
  let usuarioController: IUsuarioController
  let usuarioService: UsuarioService
  let usuarioRepository: UsuarioRepository

  beforeEach(async () => {
    await Usuario.destroy({ where: {} })

    usuarioRepository = new UsuarioRepository(Usuario)
    usuarioService = new UsuarioService(usuarioRepository)
    usuarioController = new UsuarioController(usuarioService)
  })

  // --------------------------------------------------------------------
  // ROTAS PÚBLICAS
  // --------------------------------------------------------------------

  describe('criarUsuario', () => {
    test('deve retornar 201 ao criar usuário com dados válidos', async () => {
      // Arrange
      const mockReq = criarMockRequest({
        body: {
          nome: 'João Silva',
          email: 'joao@email.com',
          passwordHash: 'senhaSegura123',
        },
      })

      const mockRes = criarMockResponse()

      // Act
      await usuarioController.criarUsuario(mockReq, mockRes)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          nome: 'João Silva',
          email: 'joao@email.com',
        }),
      )

      // Verifica no banco
      const usuarioNoBanco = await Usuario.findOne({ where: { email: 'joao@email.com' } })
      expect(usuarioNoBanco).toBeDefined()
    })

    test('deve retornar 400 ao tentar criar usuário com email duplicado', async () => {
      // Arrange
      await criarUsuario({
        nome: 'Usuario Existente',
        email: 'existente@email.com',
        passwordHash: 'senhaSegura123',
      })

      const mockReq = criarMockRequest({
        body: {
          nome: 'Novo Usuário',
          email: 'existente@email.com',
          passwordHash: 'outrasenha',
        },
      })

      const mockRes = criarMockResponse()

      // Act
      await usuarioController.criarUsuario(mockReq, mockRes)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400)
    })
  })

  describe('login', () => {
    test('deve retornar 200 e token ao fazer login com credenciais válidas', async () => {
      // Arrange
      const senhaTeste = 'minhaSenhaSecreta123'

      await criarUsuarioComSenha(senhaTeste, {
        nome: 'Usuario Login',
        email: 'login@email.com',
      })

      const mockReq = criarMockRequest({
        body: {
          email: 'login@email.com',
          senha: senhaTeste,
        },
      })

      const mockRes = criarMockResponse()

      // Act
      await usuarioController.login(mockReq, mockRes)

      // Assert - ✅ USAR type assertion nos mocks
      expect(mockRes.status as jest.Mock).toHaveBeenCalledWith(200)
      expect(mockRes.json as jest.Mock).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: expect.objectContaining({
            id: expect.any(Number),
            nome: 'Usuario Login',
            email: 'login@email.com',
          }),
          token: expect.any(String),
        }),
      )
    })

    test('deve retornar 401 ao tentar login com credenciais inválidas', async () => {
      // Arrange
      await criarUsuario({
        nome: 'Usuario Login',
        email: 'login@email.com',
        passwordHash: 'senha123',
      })

      const mockReq = criarMockRequest({
        body: {
          email: 'login@email.com',
          senha: 'senha_errada',
        },
      })

      const mockRes = criarMockResponse()

      // Act
      await usuarioController.login(mockReq, mockRes)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401)
    })
  })
})
