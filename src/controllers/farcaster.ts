import { Controller, Get, Params } from 'amala'
import { PostModel } from '@/models/Post'
import getFarcasterThread from '@/helpers/getFarcasterThread'

@Controller('/farcaster/:contractAddress')
export default class FarcasterController {
  @Get('/:postId')
  async getThread(
    @Params()
    { postId, contractAddress }: { postId: string; contractAddress: string }
  ) {
    const post = await PostModel.findOne({
      contractAddress,
      id: postId,
      postingService: 'farcaster',
    })

    if (!post || !post.serviceId)
      return {
        merkleRoot: undefined,
        casts: [],
      }

    const casts = await getFarcasterThread(contractAddress, post.serviceId)
    const rootCast = casts.find((cast) => cast.hash === cast.threadHash)

    const hash = rootCast?.hash

    return {
      hash,
      casts: await getFarcasterThread(contractAddress, post.serviceId),
    }
  }
}
