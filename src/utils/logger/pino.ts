import pino from 'pino'
import config from '@/config'

export const logger = pino({
  level: config.LOG_LEVEL,
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
