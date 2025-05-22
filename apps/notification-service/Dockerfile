FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/notification-service/package*.json apps/notification-service/

RUN npm install -g @nestjs/cli
RUN npm install

RUN echo '#!/bin/sh\n\
check_rabbitmq() {\n\
  echo "Verificando conexão com RabbitMQ..."\n\
  nc -z rabbitmq 5672\n\
  result=$?\n\
  return $result\n\
}\n\
\n\
until check_rabbitmq; do\n\
  echo "RabbitMQ não está pronto - aguardando..."\n\
  sleep 2\n\
done\n\
\n\
echo "RabbitMQ está pronto - iniciando aplicação"\n\
exec node dist/apps/notification-service/main.js\n' > /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

COPY . .

RUN npm run build notification-service

CMD ["/app/docker-entrypoint.sh"]
