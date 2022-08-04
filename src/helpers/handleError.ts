export default function (message: string, error?: unknown) {
  return console.error(message, error instanceof Error ? error.message : error)
}
