import { AlchemyProvider } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { publishCast } from '@standard-crypto/farcaster-js'
import env from '@/helpers/env'

const wallet = new Wallet(env.FARCASTER_PRIVATE_KEY)
const provider = new AlchemyProvider('goerli')
export default function (post: string) {
  return publishCast(wallet, provider, post)
}
