import { Context } from 'koa'
import { Controller, Ctx, Get, Params } from 'amala'
import { PostModel } from '@/models/Post'
import { notFound } from '@hapi/boom'
import fetch from 'node-fetch'

type Cast = {
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

    const { result: casts } = (await thread.json()) as {
      result: Cast[]
    }
    const serviceIds = casts.map((cast) => cast.merkleRoot)

    const statuses = await PostModel.find({
      contractAddress,
      serviceId: { $in: serviceIds },
      postingService: 'farcaster',
    })

    const statusesMap = new Map(
      statuses.map((status) => [status.serviceId, status.id])
    )

    return casts
      .filter((cast) => cast.body.type === 'text-short')
      .map(
        ({
          body: { publishedAt, username, data, type },
          merkleRoot,
          threadMerkleRoot,
        }) => ({
          postId: statusesMap.get(merkleRoot),
          body: {
            type,
            publishedAt,
            username,
            data,
          },
          merkleRoot,
          threadMerkleRoot,
        })
      )
  }
}
