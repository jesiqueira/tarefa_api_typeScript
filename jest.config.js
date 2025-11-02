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
    '!src/routes/**/*.ts', // Arquivos de rotas (se apenas rotearem para controllers)
    '!src/models/**/*.ts', // Arquivos de definição de modelos (entidades/tipos)
    '!**/node_modules/**',
    '!src/__tests__/**', // ← EXCLUI SEUS TESTES
    '!src/database/database.ts',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text-summary', 'lcov', 'html'],

  testTimeout: 10000,
}
