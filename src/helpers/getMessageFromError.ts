export default function (error: unknown) {
  return error instanceof Error ? error.message : error
}
