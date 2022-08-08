export const getMessageFromError = (error: unknown) => {
  return error instanceof Error ? error.message : error
}

export default function (message: string, error?: unknown) {
  return console.error(message, getMessageFromError(error))
}
