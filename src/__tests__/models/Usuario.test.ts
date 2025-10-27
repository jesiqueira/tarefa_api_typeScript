/**
 * src/__tests__/models/Usuario.test.ts
 * Versão com tipos parciais - abordagem mais correta
 */
import { Usuario } from '../../database/models/Usuario'
import type { UsuarioCreationAttributes } from '../../database/models/Usuario'

// ----------------------------------------------------------------------
// Tipos parciais para testes de validação
// ----------------------------------------------------------------------

// Tipo para criação de usuário com campos opcionais para testes
type UsuarioCreationTest = Partial<UsuarioCreationAttributes> & {
  nome?: string
  email?: string
  passwordHash?: string
}

// Tipos específicos para cada cenário de validação
type UsuarioSemNome = Omit<UsuarioCreationTest, 'nome'> & { nome?: never }
type UsuarioSemEmail = Omit<UsuarioCreationTest, 'email'> & { email?: never }
type UsuarioSemPasswordHash = Omit<UsuarioCreationTest, 'passwordHash'> & { passwordHash?: never }

// ----------------------------------------------------------------------
// Testes
// ----------------------------------------------------------------------

describe('Usuario Model', () => {
  // --------------------------------------------------------------------
  // Testes de criação válida
  // --------------------------------------------------------------------
  test('deve criar um usuário com dados válidos', async () => {
    const usuarioData: UsuarioCreationAttributes = {
      nome: 'João Silva',
      email: 'joao@email.com',
      passwordHash: 'hash123456',
    }

    const usuario = await Usuario.create(usuarioData)

    expect(usuario.id).toBeDefined()
    expect(usuario.nome).toBe(usuarioData.nome)
    expect(usuario.email).toBe(usuarioData.email)
    expect(usuario.passwordHash).toBe(usuarioData.passwordHash)
    expect(usuario.createdAt).toBeInstanceOf(Date)
    expect(usuario.updatedAt).toBeInstanceOf(Date)
  })

  // --------------------------------------------------------------------
  // Testes de validação
  // --------------------------------------------------------------------
  test('não deve criar usuário sem nome', async () => {
    const usuarioInvalido: UsuarioSemNome = {
      email: 'teste@email.com',
      passwordHash: 'hash123',
    }

    await expect(Usuario.create(usuarioInvalido as UsuarioCreationAttributes)).rejects.toThrow()
  })

  test('não deve criar usuário sem email', async () => {
    const usuarioInvalido: UsuarioSemEmail = {
      nome: 'Teste Sem Email',
      passwordHash: 'hash123',
    }

    await expect(Usuario.create(usuarioInvalido as UsuarioCreationAttributes)).rejects.toThrow()
  })

  test('não deve criar usuário sem passwordHash', async () => {
    const usuarioInvalido: UsuarioSemPasswordHash = {
      nome: 'Teste Sem Password',
      email: 'teste@email.com',
    }

    await expect(Usuario.create(usuarioInvalido as UsuarioCreationAttributes)).rejects.toThrow()
  })

  // --------------------------------------------------------------------
  // Teste de unicidade do email
  // --------------------------------------------------------------------
  test('deve garantir que email seja único', async () => {
    const usuarioData: UsuarioCreationAttributes = {
      nome: 'João Silva',
      email: 'joao@email.com',
      passwordHash: 'hash123456',
    }

    // Primeiro usuário
    await Usuario.create(usuarioData)

    // Segundo usuário com mesmo email deve falhar
    const usuarioDuplicado: UsuarioCreationAttributes = {
      nome: 'Maria Santos',
      email: 'joao@email.com', // Mesmo email
      passwordHash: 'outro_hash',
    }

    await expect(Usuario.create(usuarioDuplicado)).rejects.toThrow()
  })

  // --------------------------------------------------------------------
  // Testes de consulta
  // --------------------------------------------------------------------
  test('deve buscar usuário por email', async () => {
    const usuarioData: UsuarioCreationAttributes = {
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      passwordHash: 'hash789',
    }

    await Usuario.create(usuarioData)

    const usuarioEncontrado = await Usuario.findOne({
      where: { email: 'carlos@email.com' },
    })

    expect(usuarioEncontrado).toBeDefined()
    expect(usuarioEncontrado?.nome).toBe('Carlos Souza')
    expect(usuarioEncontrado?.email).toBe('carlos@email.com')
  })

  test('deve buscar usuário por ID', async () => {
    const usuario = await Usuario.create({
      nome: 'Busca por ID',
      email: 'buscaid@email.com',
      passwordHash: 'hash_busca',
    })

    const usuarioPorId = await Usuario.findByPk(usuario.id)

    expect(usuarioPorId).toBeDefined()
    expect(usuarioPorId?.id).toBe(usuario.id)
    expect(usuarioPorId?.nome).toBe('Busca por ID')
  })

  test('deve retornar null ao buscar usuário inexistente', async () => {
    const usuarioInexistente = await Usuario.findByPk(99999)
    expect(usuarioInexistente).toBeNull()
  })

  // --------------------------------------------------------------------
  // Testes de atualização
  // --------------------------------------------------------------------
  test('deve atualizar um usuário', async () => {
    const usuario = await Usuario.create({
      nome: 'Ana Silva',
      email: 'ana@email.com',
      passwordHash: 'hash_ana',
    })

    await usuario.update({ nome: 'Ana Silva Updated' })

    const usuarioAtualizado = await Usuario.findByPk(usuario.id)
    expect(usuarioAtualizado?.nome).toBe('Ana Silva Updated')
    // Email não deve mudar
    expect(usuarioAtualizado?.email).toBe('ana@email.com')
  })

  test('deve atualizar apenas os campos especificados', async () => {
    const usuario = await Usuario.create({
      nome: 'Pedro Santos',
      email: 'pedro@email.com',
      passwordHash: 'hash_pedro',
    })

    const originalEmail = usuario.email
    const originalPasswordHash = usuario.passwordHash

    await usuario.update({ nome: 'Pedro Santos Modificado' })

    expect(usuario.nome).toBe('Pedro Santos Modificado')
    expect(usuario.email).toBe(originalEmail)
    expect(usuario.passwordHash).toBe(originalPasswordHash)
  })

  // --------------------------------------------------------------------
  // Testes de deleção
  // --------------------------------------------------------------------
  test('deve deletar um usuário', async () => {
    const usuario = await Usuario.create({
      nome: 'Temporario',
      email: 'temp@email.com',
      passwordHash: 'hash_temp',
    })

    await usuario.destroy()

    const usuarioDeletado = await Usuario.findByPk(usuario.id)
    expect(usuarioDeletado).toBeNull()
  })

  // --------------------------------------------------------------------
  // Testes de listagem
  // --------------------------------------------------------------------
  test('deve listar todos os usuários', async () => {
    // Limpa usuários anteriores
    await Usuario.destroy({ where: {} })

    const usuariosData: UsuarioCreationAttributes[] = [
      {
        nome: 'Usuario 1',
        email: 'usuario1@email.com',
        passwordHash: 'hash1',
      },
      {
        nome: 'Usuario 2',
        email: 'usuario2@email.com',
        passwordHash: 'hash2',
      },
    ]

    await Usuario.bulkCreate(usuariosData)

    const usuarios = await Usuario.findAll()

    // Verificação principal
    expect(usuarios).toHaveLength(2)

    if (!usuarios[0] || !usuarios[1]) {
      throw new Error('Usuários não foram criados corretamente')
    }

    expect(usuarios[0].email).toBe('usuario1@email.com')
    expect(usuarios[1].email).toBe('usuario2@email.com')
    expect(usuarios[0].nome).toBe('Usuario 1')
    expect(usuarios[1].nome).toBe('Usuario 2')
  })

  // --------------------------------------------------------------------
  // Testes de instância
  // --------------------------------------------------------------------
  test('deve converter para JSON corretamente', async () => {
    const usuario = await Usuario.create({
      nome: 'JSON Test',
      email: 'json@email.com',
      passwordHash: 'hash_json',
    })

    const usuarioJson = usuario.toJSON()

    expect(usuarioJson.nome).toBe('JSON Test')
    expect(usuarioJson.email).toBe('json@email.com')
    expect(usuarioJson.passwordHash).toBe('hash_json')
    expect(usuarioJson.id).toBeDefined()
  })
})
