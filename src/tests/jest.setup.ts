/**
 * src/tests/jest.setup.ts
 * Setup global do Jest
 */
import dotenv from 'dotenv'

// Garante que variáveis do .env sejam carregadas
dotenv.config()

// Força o ambiente de teste
process.env.NODE_ENV = 'test'

// Configurações globais do Jest
jest.setTimeout(10000) // 10 segundos

// Configurações iniciais - SEM funções do Jest aqui
console.log('🔧 Ambiente de teste configurado')
