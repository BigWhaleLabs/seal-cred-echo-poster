export default function (message: string, error: unknown) {
  console.error(message, error instanceof Error ? error.message : error)
}
