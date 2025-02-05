# ==================
# ==== builder =====
# ==================

FROM node:22-bookworm as builder
    WORKDIR /app

    COPY . .

    RUN apt-get update -y && \
        apt-get install -y openssl
    RUN npm ci && \
        npm run prisma:generate && \
        npx nx build api --prod

CMD ["node", "/app/dist/apps/api/src/main.js"]

# ==================
# ==== runner ======
# ==================

FROM node:22-bookworm as runner
    WORKDIR /app

    ENV NODE_ENV production

    # create a user and a group to run the app more securely and properly
    RUN addgroup --system --gid 1001 nodejs \
        && adduser --system --uid 1001 fastify --ingroup nodejs

    # copy all the required files from the previous stage
    COPY --from=builder /app .

    # switch to the nextjs user
    USER fastify

    # start the app
    CMD ["node", "/app/dist/apps/api/src/main.js"]