import { publishCast } from '@standard-crypto/farcaster-js'
import env from '@/helpers/env'

export default function (post: string) {
  return publishCast(env.FARCASTER_PRIVATE_KEY, post)
}
