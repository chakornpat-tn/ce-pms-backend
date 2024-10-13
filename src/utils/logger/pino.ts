import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      showTime: true,
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
      timezone: 'GMT+7',
      ignore: 'pid,hostname',
      colorize: true,
    },
  },
})

