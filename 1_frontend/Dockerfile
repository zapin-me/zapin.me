FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Next.js inlines NEXT_PUBLIC_* values at build time. Use the deployment's .env
# when present, otherwise the sample, and refuse anything that is not public.
RUN if [ ! -f .env ]; then cp .env-sample .env; fi \
  && node scripts/check-public-env.mjs .env

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-slim AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build --chown=node:node /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/next.config.mjs /usr/src/app/.env ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "run", "start:prod"]
