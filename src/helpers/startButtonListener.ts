import { ButtonInteraction, TextChannel } from 'discord.js'
import { PostModel } from '@/models/Post'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import PostType from '@/models/PostType'
import Status from '@/models/Status'
import getDerivativeSymbolOrName from '@/helpers/getDerivativeSymbolOrName'
import handleError from '@/helpers/handleError'
import sendErrorToDiscord from '@/helpers/sendErrorToDiscord'
import sendTweet from '@/helpers/sendTweet'

const getPostById = (id: number, type: PostType) => {
  if (type === PostType.email) return scEmailPostsContract.posts(id)

  return scErc721PostsContract.posts(id)
}

const getPostContent = async (id: number, type: PostType) => {
  const { post, derivativeAddress } = await getPostById(id, type)

  const name = await getDerivativeSymbolOrName(derivativeAddress, type)
  type === PostType.email && name.replace(' email', '').replace('@', '')

  return `${post} @ ${name.replace('.', '\u2024')}`
}

export default function (channel: TextChannel) {
  console.log('Starting Discord button listener...')
  const collector = channel.createMessageComponentCollector({
    filter: (message) =>
      /(approve|reject)-\d+-(erc721|email)/gi.test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    await interaction.message.edit({
      components: [],
    })
    const isApprove = interaction.customId.startsWith('approve')
    const words = interaction.customId.split('-')
    const id = parseInt(words[1])
    const type = words[2] as PostType
    await PostModel.updateOne(
      {
        id,
        type,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
    if (!isApprove) return

    const postContent = await getPostContent(id, type)
    try {
      const sentTweet = await sendTweet(postContent)
      if (sentTweet.errors && sentTweet.errors.length > 0)
        throw new Error(sentTweet.errors[0].reason)

      await PostModel.updateOne(
        {
          id,
          type,
        },
        { statusId: sentTweet.data.id, status: Status.published }
      )
    } catch (error) {
      handleError('Error sending post to Twitter', error)
      await sendErrorToDiscord(channel, error, 'tweeting', {
        id,
        postContent,
        type,
      })
    }
  })
  console.log('Started Discord button listener')
}
