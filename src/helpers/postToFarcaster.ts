import { Wallet } from 'ethers'
import { publishCast } from '@standard-crypto/farcaster-js'
import env from '@/helpers/env'
import provider from '@/helpers/provider'

const wallet = new Wallet(env.FARCASTER_PRIVATE_KEY)
export default function (post: string) {
  return publishCast(wallet, provider, post)
}
