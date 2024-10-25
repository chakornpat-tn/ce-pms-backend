FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY src ./src
COPY ./.env ./.env
COPY tsconfig.json ./
COPY prisma ./prisma

RUN bun install
RUN bunx prisma generate

EXPOSE 8000
CMD ["bun","./src/index.ts"]