interface ResponseFormat<T = any> {
  title: string
  details: string
  data?: T
  error?: string
}

interface ResponseFormat<T = any> {
  title: string
  details: string
  data?: T
  error?: string
}

const SuccessMessage = <T>(
  title: string,
  details: string,
  data?: T
): ResponseFormat<T> => {
  return {
    title,
    details,
    data,
  }
}

const NotFoundMessage = (
  title = 'Result not found',
  details = 'The requested result was not found'
): ResponseFormat => {
  return {
    title,
    details,
  }
}

const ErrorMessage = (
  title: string,
  details: string,
  error?: Error | string
): ResponseFormat => {
  return {
    title,
    details,
    error: error
      ? typeof error === 'string'
        ? error
        : error.message
      : undefined,
  }
}

const UnauthorizedMessage = (
  title: string = 'Unauthorized',
  details: string = 'You are not authorized to access this resource'
): ResponseFormat => {
  return {
    title,
    details,
  }
}

export { SuccessMessage, NotFoundMessage, ErrorMessage, UnauthorizedMessage }
