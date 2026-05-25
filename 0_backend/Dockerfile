FROM node:22-slim

WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY package-lock.json ./

RUN npm_config_build_from_source=true npm ci

COPY . .

# RUN npm run build

ENTRYPOINT npm run start:dev
