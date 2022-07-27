export default interface TwitterError {
  data: {
    detail: string
    type: string
    title: string
    stauts: number
  }
}
