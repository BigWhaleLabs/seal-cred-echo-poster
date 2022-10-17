export enum CastType {
  TextShort = 'text-short',
}

export interface Cast {
  merkleRoot: string
  threadMerkleRoot: string
  body: {
    type: CastType
    publishedAt: number
    username: string
    data: {
      text: string
      replyParentMerkleRoot: string
    }
  }
}
