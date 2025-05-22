FROM node:20-alpine

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY apps/expense-service/package*.json apps/expense-service/

RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

RUN npm run build expense-service

EXPOSE 3001

CMD ["node", "dist/apps/expense-service/main.js"]
