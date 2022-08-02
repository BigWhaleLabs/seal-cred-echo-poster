import { ButtonInteraction, TextChannel } from 'discord.js'
import { PostModel } from '@/models/Post'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import Status from '@/models/Status'
import getDerivativeDomain from '@/helpers/getDerivativeDomain'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import sendTweet from '@/helpers/sendTweet'

const getDataFromId = async (id: number) => {
  const { post, derivativeAddress } = await scErc721PostsContract.posts(id)
  if (post) return { post, derivativeAddress }
  return scEmailPostsContract.posts(id)
}

export default function (channel: TextChannel) {
  console.log('Starting Discord button listener...')
  const collector = channel.createMessageComponentCollector({
    filter: (message) => /(approve|reject)-\d+/gi.test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    await interaction.message.edit({
      components: [],
    })
    const isApprove = interaction.customId.startsWith('approve')
    const id = parseInt(interaction.customId.split('-')[1])
    await PostModel.updateOne(
      {
        id,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
    if (isApprove) {
      const { post, derivativeAddress } = await getDataFromId(id)
      const domain = (await getDerivativeDomain(derivativeAddress))
        .replace(' email', '')
        .replace('@', '')
      const tweetContent = `${post} @ ${domain}.replace('.', '\u2024')`
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
    }
  })
  console.log('Started Discord button listener')
}
