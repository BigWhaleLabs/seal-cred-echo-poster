import {
  Farcaster,
  FarcasterGuardianContentHost,
} from '@standard-crypto/farcaster-js'
import { Wallet } from 'ethers'
import env from '@/helpers/env'

/**
 * Credit: https://gist.github.com/gskril/ffaa16540c35c05a2ae20c70237bd94d
 * MODIFIED FROM STANDARD-CRYPTO LIBRARY
 * Signs and publishes a simple text string.
 * The cast will be attributed to the username currently registered
 * to the given private key's address.
 */
const _defaultFarcaster = new Farcaster()
async function publishCast(privateKey: string, text: string, replyTo?: string) {
  const contentHost = new FarcasterGuardianContentHost(privateKey)
  const signer = new Wallet(privateKey)
  const unsignedCast = await _defaultFarcaster.prepareCast({
    fromUsername: 'sealcaster',
    text,
    replyTo,
  })
  const signedCast = await Farcaster.signCast(unsignedCast, signer)
  await contentHost.publishCast(signedCast)
  return signedCast
}

export default async function (post: string, replyToId?: string) {
  const cast = await publishCast(env.FARCASTER_PRIVATE_KEY, post, replyToId)
  return cast.merkleRoot
}
