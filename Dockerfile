FROM oven/bun:latest

WORKDIR /app

COPY . . 
RUN bun install
RUN bunx prisma generate
RUN bunx prisma migrate deploy

EXPOSE 8000/tcp
CMD ["bun","dev"]