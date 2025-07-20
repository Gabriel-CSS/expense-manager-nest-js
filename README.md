# Expense Manager

Sistema de gerenciamento de despesas baseado em microsserviços com NestJS.

## Arquitetura

- Auth Service (porta 3000): gerenciamento de usuários, autenticação JWT, refresh tokens, validação de dados, Swagger.
- Expense Service (porta 3001): gerenciamento de despesas e categorias, integração com RabbitMQ, Swagger, paginação e filtros.
- Notification Service: mensageria com RabbitMQ, envio de emails, processamento assíncrono.

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- RabbitMQ
- JWT
- Swagger
- Docker
- TypeScript

## Pré-requisitos

- Node.js v18+
- Docker e Docker Compose
- PostgreSQL
- RabbitMQ

## Instalação

1. Clonar o repositório
2. Instalar dependências:
```bash
npm install
```
3. Configurar variáveis de ambiente:
```env
# Auth Service
NODE_ENV=production
DB_HOST=postgres-auth
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expense_manager_auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=1d

# Expense Service
NODE_ENV=production
DB_HOST=postgres-expense
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expense_manager_expenses
JWT_SECRET=your-super-secret-key
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Notification Service
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
4. Subir serviços:
```bash
docker-compose up --build
```

## Documentação da API

- Auth Service: http://localhost:3000/api
- Expense Service: http://localhost:3001/api

## Segurança

- Autenticação JWT
- Refresh Tokens
- Validação de dados
- Senhas criptografadas

## Estrutura do Projeto

```
apps/
├── api-gateway/
├── auth-service/
├── expense-service/
└── notification-service/
k8s/
```

---

## Execução via Kubernetes

### Pré-requisitos
- Docker Desktop com Kubernetes ativado
- kubectl

### Build das imagens Docker
```bash
docker build -t api-gateway:latest -f apps/api-gateway/Dockerfile .
docker build -t auth-service:latest -f apps/auth-service/Dockerfile .
docker build -t expense-service:latest -f apps/expense-service/Dockerfile .
docker build -t notification-service:latest -f apps/notification-service/Dockerfile .
```

### Subir registry local
```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

### Enviar imagens para o registry local
```bash
docker tag api-gateway:latest 127.0.0.1:5000/api-gateway:latest
docker push 127.0.0.1:5000/api-gateway:latest

docker tag auth-service:latest 127.0.0.1:5000/auth-service:latest
docker push 127.0.0.1:5000/auth-service:latest

docker tag expense-service:latest 127.0.0.1:5000/expense-service:latest
docker push 127.0.0.1:5000/expense-service:latest

docker tag notification-service:latest 127.0.0.1:5000/notification-service:latest
docker push 127.0.0.1:5000/notification-service:latest
```

### Aplicar manifests Kubernetes
```bash
kubectl apply -f k8s/
kubectl apply -f apps/auth-service/k8s/
kubectl apply -f apps/expense-service/k8s/
kubectl apply -f apps/notification-service/k8s/
kubectl apply -f apps/api-gateway/k8s/
```

### Acesso aos microsserviços

- Auth Service:
  ```sh
  kubectl port-forward svc/auth-service 3000:3000
  ```
  http://localhost:3000

- Expense Service:
  ```sh
  kubectl port-forward svc/expense-service 3001:3001
  ```
  http://localhost:3001

- Notification Service:
  ```sh
  kubectl port-forward svc/notification-service 3003:3003
  ```
  http://localhost:3003

- RabbitMQ Management:
  ```sh
  kubectl port-forward svc/rabbitmq 15672:15672
  ```
  http://localhost:15672 (usuário: guest, senha: guest)

- Postgres:
  ```sh
  kubectl port-forward svc/postgres-auth 5432:5432
  ```
  Conexão em localhost:5432

---

