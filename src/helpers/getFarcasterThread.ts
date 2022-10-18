import { Cast, CastType } from '@/models/Cast'
import { PostModel } from '@/models/Post'
import fetch from 'node-fetch'

export default async function (contractAddress: string, threadId: string) {
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
    .filter((cast) => cast.body.type === CastType.TextShort)
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
