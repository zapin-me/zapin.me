FROM node:21.6.2-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

# RUN npm run build

ENTRYPOINT npm run start:dev
