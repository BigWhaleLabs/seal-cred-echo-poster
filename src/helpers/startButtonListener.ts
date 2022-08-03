import { ButtonInteraction, TextChannel } from 'discord.js'
import { PostModel } from '@/models/Post'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import PostType from '@/models/PostType'
import Status from '@/models/Status'
import getDerivativeSymbolOrName from '@/helpers/getDerivativeSymbolOrName'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import sendTweet from '@/helpers/sendTweet'

const getPostById = (id: number, type: PostType) => {
  if (type === PostType.email) {
    return scEmailPostsContract.posts(id)
  }
  return scErc721PostsContract.posts(id)
}

const getTweetContent = async (id: number, type: PostType) => {
  const { post, derivativeAddress } = await getPostById(id, type)

  const name = (await getDerivativeSymbolOrName(derivativeAddress, type))
    .replace(' email', '')
    .replace('@', '')
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

    const tweetContent = await getTweetContent(id, type)
    try {
      const sentTweet = await sendTweet(tweetContent)
      if (sentTweet.errors && sentTweet.errors.length > 0)
        throw new Error(sentTweet.errors[0].reason)

      await PostModel.updateOne(
        {
          id,
        },
        { statusId: sentTweet.data.id, status: Status.published }
      )
    } catch (error) {
      await sendErrorOnDiscord(channel, error, 'tweeting', {
        tweetId: id,
        tweetContent,
      })
      console.error(
        'Error sending tweet:',
        error instanceof Error ? error.message : error
      )
    }
  })
  console.log('Started Discord button listener')
}
