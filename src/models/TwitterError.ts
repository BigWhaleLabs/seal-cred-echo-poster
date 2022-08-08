export default interface TwitterError {
  data: {
    detail: string
    type: string
    title: string
    status: number
  }
}
