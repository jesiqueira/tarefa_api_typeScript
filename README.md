# 🚀 API de Gestão de Tarefas (To-Do)

Uma API RESTful moderna para gestão de tarefas e usuários, desenvolvida em TypeScript com Express.js, PostgreSQL e documentação Swagger.

## ✨ Características

- **🔐 Autenticação JWT** - Sistema seguro de autenticação
- **📝 CRUD Completo** - Operações completas para usuários e tarefas
- **🐘 PostgreSQL** - Banco de dados relacional robusto
- **📚 Swagger UI** - Documentação interativa da API
- **🐳 Docker** - Containerização para desenvolvimento e produção
- **🧪 TypeScript** - Código tipado e mais seguro
- **🛡️ CORS** - Configuração de segurança para frontends
- **✅ Validação** - Schemas de validação com Zod

## 🛠️ Tecnologias

- **Backend:** Node.js, Express.js, TypeScript
- **Banco de Dados:** PostgreSQL, Sequelize ORM
- **Autenticação:** JWT (JSON Web Tokens)
- **Validação:** Zod - Schema validation
- **Documentação:** Swagger/OpenAPI 3.0
- **Containerização:** Docker, Docker Compose
- **Ferramentas:** PgAdmin, CORS, Bcrypt

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

## 🚀 Como Executar

### Usando Docker (Recomendado)

1. **Clone o repositório:**
```bash
git clone https://github.com/jesiqueira/tarefa_api_typeScript
cd tarefa_api_typeScript
```
2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```
3. **Execute com Docker Compose:**
```bash
docker-compose up -d
```
4. **Acesse a aplicação:**
      - API: http://localhost:3000
      - Documentação Swagger: http://localhost:3000/docs
      - PgAdmin: http://localhost:8080

## Desenvolvimento Local
1. **Instale as dependências:**
```bash
npm install
```
2. **Configure o banco de dados PostgreSQL**
3. **Execute em modo desenvolvimento:**
```bash
npm run dev
```
## 📁 Estrutura do Projeto

```text
tarefa_api_typeScript/
├── 📂 src/
│ ├── 📂 tests/ # Testes automatizados (Jest + Supertest)
│ ├── 📂 controllers/ # Controladores - lidam com requests/responses HTTP
│ ├── 📂 database/ # Models do Sequelize e configuração do DB
│ ├── 📂 errors/ # Erros customizados da aplicação
│ ├── 📂 factories/ # Factories para criar dados de teste
│ ├── 📂 middlewares/ # Autenticação JWT, validação Zod, etc.
│ ├── 📂 repositories/ # Camada de acesso a dados (Sequelize)
│ ├── 📂 routes/ # Definição de rotas Express
│ ├── 📂 schemas/ # Schemas de validação com Zod
│ ├── 📂 services/ # Lógica de negócio da aplicação
│ ├── 📂 tests/ # Configurações e helpers de teste
│ ├── 📂 utils/ # Funções utilitárias e helpers
│ ├── 📄 app.ts # Configuração do Express e middlewares
│ └── 📄 server.ts # Inicialização do servidor
│
├── ⚙️ Arquivos de Configuração:
│ ├── 🔧 .dockerignore # Exclusões para Docker
│ ├── 🔧 .editorconfig # Padrões de código
│ ├── 🔧 .env # Variáveis de ambiente
│ ├── 🔧 .prettierrc # Formatação de código
│ ├── 🔧 docker-compose.yml # Serviços Docker
│ ├── 🔧 eslint.config.mjs # Regras ESLint
│ ├── 🔧 jest.config.js # Configuração de testes
│ ├── 🔧 swagger.yaml # Documentação OpenAPI
│ └── 🔧 tsconfig.json # Configuração TypeScript
│
├── 📄 package.json # Dependências e scripts npm
├── 📄 LICENSE # Licença MIT
└── 📄 README.md # Este arquivo
```
## 🔌 Endpoints da API

## Autenticação

- POST /api/usuarios/cadastro - Registrar novo usuário
- POST /api/usuarios/login - Fazer login

## Usuários (Protegidos)

- GET /api/usuarios/me - Buscar usuário logado
- PUT /api/usuarios/me - Atualizar usuário
- DELETE /api/usuarios/me - Deletar usuário

## Tarefas (Protegidos)

- GET /api/tarefas - Listar tarefas com filtros
- POST /api/tarefas - Criar nova tarefa
- GET /api/tarefas/:id - Buscar tarefa por ID
- PUT /api/tarefas/:id - Atualizar tarefa
- DELETE /api/tarefas/:id - Deletar tarefa
- GET /api/tarefas/status/:status - Buscar por status
- PATCH /api/tarefas/:id/concluir - Marcar como concluída

## 🔧 Variáveis de Ambiente

```env
# Aplicação
NODE_ENV=development
PORT=3000

# Banco de Dados
DB_HOST=database
DB_PORT=5432
DB_NAME=myapp
DB_USER=dev
DB_PASSWORD=dev123

# JWT
JWT_SECRET=seu_jwt_secret_aqui

# PgAdmin
PGADMIN_EMAIL=admin@app.com
PGADMIN_PASSWORD=admin123
```
## 🗄️ Configuração do Banco de Dados

## Acessando o PgAdmin

1. Acesse http://localhost:8080
2. Login com as credenciais do .env
3. Adicione um novo servidor:
     - Host: database
     - Port: 5432
     - Database: myapp
     - Username/Password: Do arquivo .env

## Modelos do Banco

### Usuarios:
 - id, nome, email, passwordHash, createdAt, updatedAt
### Tarefas:
  - id, titulo, descricao, status, usuarioId, createdAt, updatedAt

## 🧪 Testando a API
## 1. **Registrar usuário**
```bash
curl -X POST http://localhost:3000/api/usuarios/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```
## 2. **Fazer login** 
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
  ```
## 3. **Criar tarefa (com token JWT)**
```bash
curl -X POST http://localhost:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -d '{
    "titulo": "Minha primeira tarefa",
    "descricao": "Descrição da tarefa",
    "status": "pendente"
  }'
```
## 🐳 Comandos Docker Úteis
```bash
# Ver logs da aplicação
docker logs node_app -f

# Executar comandos dentro do container
docker exec -it node_app sh

# Parar todos os containers
docker-compose down

# Rebuild da aplicação
docker-compose up --build

# Ver status dos containers
docker-compose ps
```
## 📚 Documentação
A documentação interativa da API está disponível em:
http://localhost:3000/docs

Na documentação Swagger você pode:
- Visualizar todos os endpoints
- Testar as requisições diretamente na UI
- Ver exemplos de requests e responses
- Entender os schemas de dados

## 🔒 Autenticação
A API usa autenticação JWT (Bearer Token). Para acessar endpoints protegidos:

1. Faça login ou registro para obter o token
2. Inclua o token no header das requisições:
```text
Authorization: Bearer <seu-token-jwt>
```
## 🚧 Desenvolvimento

### Scripts disponíveis
```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Build para produção
npm run start        # Produção
npm run lint         # Verificação de código
npm run lint:fix     # correção com lint
npm run test         # test com jest
```
# Adicionando novas rotas
1. Crie o schema de validação em src/schemas/ usando Zod
2. Adicione a rota em src/routes/
3. Implemente o controller em src/controllers/
4. Atualize a documentação no swagger.yaml

# 🔄 Git Workflow
### Este projeto segue o Git Flow para organização do código:

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `hotfix/*` - Correções urgentes

**Padrão de commits:** feat, fix, docs, style, refactor, test

# 🤝 Contribuindo
1. Fork o projeto
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudanças (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

# 📄 Licença
### Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

# 👨‍💻 Autor
### Desenvolvido por José Edmar De Siqueira - edmar.ade@gmail.com


## ⭐️ Se este projeto te ajudou, deixe uma estrela no repositório!
