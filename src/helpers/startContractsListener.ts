import { BigNumber } from 'ethers'
import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
  scExternalErc721PostsContract,
} from '@/helpers/postsContracts'
import ContractType from '@/models/ContractType'
import handleError from '@/helpers/handleError'
import sendPostToDiscord from '@/helpers/sendPostToDiscord'

const listenerCallback = async (
  channel: TextChannel,
  type: ContractType,
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
    handleError('Error sending post to Discord', error)
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
        ContractType.erc721,
        postIdBigNumber,
        text,
        derivativeAddress
      )
  )
  console.log('Started SCERC721Posts contract listener')

  console.log('Starting SCExternalErc721Posts contract listener...')
  scExternalErc721PostsContract.on(
    scExternalErc721PostsContract.filters.PostSaved(),
    (postIdBigNumber, text, derivativeAddress) =>
      listenerCallback(
        channel,
        ContractType.externalErc721,
        postIdBigNumber,
        text,
        derivativeAddress
      )
  )
  console.log('Started SCExternalErc721Posts contract listener')

  console.log('Starting SCEmailPosts contract listener...')
  scEmailPostsContract.on(
    scEmailPostsContract.filters.PostSaved(),
    (postIdBigNumber, text, derivativeAddress) =>
      listenerCallback(
        channel,
        ContractType.email,
        postIdBigNumber,
        text,
        derivativeAddress
      )
  )
  console.log('Started SCEmailPosts contract listener')
}
