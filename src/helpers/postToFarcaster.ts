import { MerkleAPIClient } from '@standard-crypto/farcaster-js'
import { Wallet } from 'ethers'
import env from '@/helpers/env'

const client = new MerkleAPIClient(new Wallet(env.FARCASTER_PRIVATE_KEY))

export default async function (post: string, replyToId?: string) {
  const cast = replyToId ? await client.fetchCast(replyToId) : undefined
  const publishedCast = await client.publishCast(post, cast)
  return publishedCast.hash
}
