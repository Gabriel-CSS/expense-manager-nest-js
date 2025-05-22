# Expense Manager

Sistema de gerenciamento de despesas construído com NestJS usando uma arquitetura de microsserviços.

## 🏗️ Arquitetura

O sistema é composto por 3 microsserviços principais:

### 1. Auth Service (Porta 3000)
- Gerenciamento de usuários (CRUD)
- Autenticação JWT
- Refresh Tokens
- Validação de dados
- Documentação Swagger

### 2. Expense Service (Porta 3001)
- Gerenciamento de despesas
- Gerenciamento de categorias
- Integração com RabbitMQ para notificações
- Documentação Swagger
- Paginação e filtros

### 3. Notification Service
- Serviço de mensageria usando RabbitMQ
- Envio de emails para notificações
- Processamento assíncrono de eventos

## 🚀 Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- RabbitMQ
- JWT
- Swagger
- Docker
- TypeScript

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- PostgreSQL
- RabbitMQ

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente para cada serviço:

```env
# .env (Auth Service)
NODE_ENV=production
DB_HOST=postgres-auth
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expense_manager_auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=1d

# .env (Expense Service)
NODE_ENV=production
DB_HOST=postgres-expense
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expense_manager_expenses
JWT_SECRET=your-super-secret-key
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# .env (Notification Service)
NODE_ENV=production
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_NOTIFICATION_QUEUE=notification_queue
EMAIL_HOST=smtp.exemplo.com
EMAIL_USERNAME=seu_email
EMAIL_PASSWORD=sua_senha
EMAIL_PORT=587
EMAIL_FROM_NAME=ExpenseManager
EMAIL_FROM_ADDRESS=noreply@exemplo.com
```

4. Inicie os serviços:
```bash
docker-compose up --build
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger em:

#### Auth Service
```
http://localhost:3000/api
```
#### Expense Service
```
http://localhost:3000/api
```

## 🔒 Segurança

- Autenticação JWT
- Refresh Tokens
- Validação de dados
- Senhas criptografadas


## 📦 Estrutura do Projeto

```
apps/
├── api-gateway/         # Gateway de API (em desenvolvimento)
├── auth-service/        # Serviço de autenticação
├── expense-service/     # Serviço de despesas
└── notification-service/ # Serviço de notificações
```
