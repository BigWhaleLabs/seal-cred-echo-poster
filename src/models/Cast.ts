export interface Cast {
  timestamp: number
  hash: string
  parentHash: string
  threadHash: string
  author: {
    username: string
    fid: number
  }
  text: string
}
