export default function (s: number) {
  return new Promise((res) => setTimeout(res, s * 1000))
}
