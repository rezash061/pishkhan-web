# Self-hosted standalone build (no Vercel), for the domestic zone behind Nginx.
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Pages are generated at build time; point PISHKHAN_API_URL at a reachable backend so pricing is prerendered
# from real plans (otherwise it is fetched on the first revalidation).
ARG PISHKHAN_API_URL=http://localhost:5080
ARG SITE_URL=https://pishkhan.ir
ARG PANEL_URL=https://app.pishkhan.ir
ARG SIGNUP_MODE=waitlist
ENV PISHKHAN_API_URL=$PISHKHAN_API_URL SITE_URL=$SITE_URL PANEL_URL=$PANEL_URL SIGNUP_MODE=$SIGNUP_MODE
RUN pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
