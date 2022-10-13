import { Context } from 'koa'
import { Controller, Ctx, Get, Params } from 'amala'
import { PostModel } from '@/models/Post'
import { notFound } from '@hapi/boom'
import fetch from 'node-fetch'

@Controller('/farcaster/:contractAddress/')
export default class FarcasterController {
  @Get('/:threadId')
  async getThread(
    @Params()
    {
      threadId,
      contractAddress,
    }: { threadId: string; contractAddress: string },
    @Ctx() ctx: Context
  ) {
    const post = await PostModel.find({
      contractAddress,
      serviceId: threadId,
      postingService: 'farcaster',
    })

    if (!post) return ctx.throw(notFound())

    const thread = await fetch(
      `https://api.farcaster.xyz/indexer/threads/${threadId}?viewer_address=0xCF934d6D78Db960981Ff4C381c7f16eF71FB91B3`
    )

    const { result } = await thread.json()
    const casts = result as { merkleRoot: string }[]
    const serviceIds = casts.map((cast) => cast.merkleRoot)

    const statuses = await PostModel.find({
      contractAddress,
      serviceId: { $in: serviceIds },
      postingService: 'farcaster',
    })

    const statusesMap = new Map(
      statuses.map((status) => [status.serviceId, status.id])
    )

    return casts.map((cast) => ({
      postId: statusesMap.get(cast.merkleRoot),
      ...cast,
    }))
  }
}
