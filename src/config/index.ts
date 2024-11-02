export default {
  RUN_ENV: process.env.NODE_ENV || 'dev',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: process.env.PORT || '',
  TOKEN_SECRET: process.env.TOKEN_SECRET || '',
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 0,
  DATABASE_URL: process.env.DATABASE_URL || '',
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID || '',
  GOOGLE_STORAGE_BUCKET_NAME: process.env.GOOGLE_STORAGE_BUCKET_NAME || '',
  GOOGLE_APPLICATION_CREDENTIALS:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
}
