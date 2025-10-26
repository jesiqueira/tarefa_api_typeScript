// src/tests/jest.setup.ts
import dotenv from 'dotenv'

// Garante que variáveis do .env sejam carregadas
dotenv.config()

// Força o ambiente de teste
process.env.NODE_ENV = 'test'

// Configurações extras opcionais para Jest
jest.setTimeout(10000) // Aumenta timeout global (10s)
