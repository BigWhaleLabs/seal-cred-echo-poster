import getMessageFromError from '@/helpers/getMessageFromError'

export default function (message: string, error?: unknown) {
  return console.error('Error', message, getMessageFromError(error))
}
