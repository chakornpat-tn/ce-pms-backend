## Environment Variables
Create a `.env` file in the root directory with the following variables:
```bash
RUN_ENV=dev
API_PORT=8000
TOKEN_SECRET=TokenSecret
SALT_ROUNDS=SaltRounds
DATABASE_URL="postgresql://Username:password@Host:Port/DbName"
GOOGLE_PROJECT_ID=GoogleProjectID
GOOGLE_STORAGE_BUCKET_NAME=GCCStorageBucketName
GOOGLE_APPLICATION_CREDENTIALS=GoogleApplicationCredentials
```

## Database Management

To create a new migration after modifying your Prisma schema:
```bash
bunx prisma migrate dev
```

To reset your database:
```bash
bunx prisma migrate reset
```

To view and manage your data with Prisma Studio:
```bash
bunx prisma studio
```
# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```
Open http://localhost:3000/ with your browser to see the result.