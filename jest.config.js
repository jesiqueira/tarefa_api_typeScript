//jest.config.js

const { createDefaultPreset } = require('ts-jest')
const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],

  transform: {
    ...tsJestTransformCfg,
    '^.+\\.tsx?$': ['ts-jest', {}],
  },

  setupFiles: ['<rootDir>/src/tests/jest.setup.ts'], // 👈 AQUI
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupDatabase.ts'],

  // ✅ Configure para mostrar describes
  verbose: true,

  // ✅ ADICIONE ESTA CONFIGURAÇÃO PARA IGNORAR HELPERS
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/__tests__/helpers/', // ← IGNORA HELPERS
    '/src/__tests__/factories/', // ← IGNORA FACTORIES
    '/src/tests/', // ← IGNORA ARQUIVOS DE SETUP
  ],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts', // INCLUI TUDO EM SRC

    // EXCLUSÕES (Ajuste ou adicione o que não é lógica de negócio/teste)
    '!src/server.ts', // Inicialização do servidor (apenas bootstrap)
    '!src/errors/**/*.ts', // IGNORA erros
    '!src/app.ts', // Definição da instância Express (sem lógica)
    '!src/database/config.ts', // Configurações do DB (sem lógica de execução)
    '!src/database/connection.ts', // Inicialização da conexão (sem lógica)
    '!src/tests/**', // Arquivos de setup do Jest e testes
    '!src/routes/**/*.ts', // EXCLUI ROTAS - CORRETO!
    '!src/database/models/**/*.ts', // Exclui modelos (apenas definições)
    '!src/schemas/**/*.ts', // Exclui schemas (apenas validações)
    '!src/middlewares/interfaces/**/*.ts', // Exclui interfaces
    '!src/repositories/interfaces/**/*.ts', // Exclui interfaces
    '!src/controllers/interfaces/**/*.ts', // Exclui interfaces
    '!src/models/**/*.ts', // Arquivos de definição de modelos (entidades/tipos)
    '!**/node_modules/**',
    '!src/__tests__/**', // ← EXCLUI SEUS TESTES
    '!src/database/database.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/helpers/**',
    '!src/__tests__/factories/**',
  ],

  // ADICIONE para ignorar declarações de tipos
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/database/models/', // Definições de modelo
    '/src/schemas/', // Schemas de validação
    '/src/routes/', // Configuração de rotas
    '/interfaces/', // Interfaces
    '\\.d\\.ts$', // Arquivos de definição TypeScript
  ],
  coverageReporters: ['text-summary', 'lcov', 'html'],

  testTimeout: 10000,
}
