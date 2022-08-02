import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import sendTweetOnDiscord from '@/helpers/sendPostOnDiscord'

export default function (channel: TextChannel) {
  console.log('Starting SCERC721Posts contract listener...')
  scErc721PostsContract.on(
    scErc721PostsContract.filters.PostSaved(),
    async (postIdBigNumber, text, derivativeAddress) => {
      const id = postIdBigNumber.toNumber()
      const post = await PostModel.findOne({
        id,
      })

      if (post) return

      try {
        await sendTweetOnDiscord(channel, id, derivativeAddress, text)
      } catch (error) {
        console.error(
          'Error posting tweet on Discord',
          error instanceof Error ? error.message : error
        )
      }
      await PostModel.create({
        id,
      })
    }
  )
  console.log('Started SCERC721Posts contract listener')

  console.log('Starting SCEmailPosts contract listener...')
  scEmailPostsContract.on(
    scEmailPostsContract.filters.PostSaved(),
    async (postIdBigNumber, text, derivativeAddress) => {
      const id = postIdBigNumber.toNumber()
      const post = await PostModel.findOne({
        id,
      })

      if (post) return

      try {
        await sendTweetOnDiscord(channel, id, derivativeAddress, text)
      } catch (error) {
        console.error(
          'Error posting tweet on Discord',
          error instanceof Error ? error.message : error
        )
      }
      await PostModel.create({
        id,
      })
    }
  )
  console.log('Started SCEmailPosts contract listener')
}
