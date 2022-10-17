export interface Cast {
  merkleRoot: string
  threadMerkleRoot: string
  body: {
    type: string
    publishedAt: number
    username: string
    data: {
      text: string
      replyParentMerkleRoot: string
    }
  }
}
