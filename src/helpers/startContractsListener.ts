import { BigNumber } from 'ethers'
import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import PostType from '@/models/PostType'
import sendPostToDiscord from '@/helpers/sendPostToDiscord'

const listenerCallback = async (
  channel: TextChannel,
  type: PostType,
  postIdBigNumber: BigNumber,
  text: string,
  derivativeAddress: string
) => {
  const id = postIdBigNumber.toNumber()
  const post = await PostModel.findOne({
    type,
    id,
  })

  if (post) return

  try {
    await sendPostToDiscord(channel, id, type, derivativeAddress, text)
  } catch (error) {
    console.error(
      'Error posting on Discord',
      error instanceof Error ? error.message : error
    )
  }
  await PostModel.create({
    type,
    id,
  })
}

export default function (channel: TextChannel) {
  console.log('Starting SCERC721Posts contract listener...')
  scErc721PostsContract.on(
    scErc721PostsContract.filters.PostSaved(),
    (postIdBigNumber, text, derivativeAddress) =>
      listenerCallback(
        channel,
        PostType.erc721,
        postIdBigNumber,
        text,
        derivativeAddress
      )
  )
  console.log('Started SCERC721Posts contract listener')

  console.log('Starting SCEmailPosts contract listener...')
  scEmailPostsContract.on(
    scEmailPostsContract.filters.PostSaved(),
    (postIdBigNumber, text, derivativeAddress) =>
      listenerCallback(
        channel,
        PostType.email,
        postIdBigNumber,
        text,
        derivativeAddress
      )
  )
  console.log('Started SCEmailPosts contract listener')
}
