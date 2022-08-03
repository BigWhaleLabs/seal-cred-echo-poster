import { ButtonInteraction, TextChannel } from 'discord.js'
import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import getSymbol from '@/helpers/getSymbol'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import sendTweet from '@/helpers/sendTweet'

export default function (channel: TextChannel, postStorage: SCPostStorage) {
  console.log('Starting Discord button listener...')
  const collector = channel.createMessageComponentCollector({
    filter: (message) =>
      RegExp(`/(a|r)-${postStorage}-\\d+/gi`).test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    await interaction.message.edit({
      components: [],
    })
    const isApprove = interaction.customId.startsWith('a')
    const components = interaction.customId.split('-')
    const contractAddress = components[1]
    const tweetId = parseInt(components[2])
    await TweetModel.updateOne(
      {
        contractAddress,
        tweetId: tweetId,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
    if (isApprove) {
      const { post, derivativeAddress } = await postStorage.posts(tweetId)
      const symbol = (await getSymbol(derivativeAddress)).slice(0, -2) // cut extra "-d"
      const tweetContent = `${post} @ ${symbol}.replace('.', '\u2024')` // replace dot with unicode character
      try {
        const sentTweet = await sendTweet(tweetContent)
        if (sentTweet.errors && sentTweet.errors.length > 0) {
          throw new Error(sentTweet.errors[0].reason)
        }
        await TweetModel.updateOne(
          {
            contractAddress,
            tweetId: tweetId,
          },
          { statusId: sentTweet.data.id, status: Status.published }
        )
      } catch (error) {
        await sendErrorOnDiscord(channel, error, 'tweeting', {
          tweetId,
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
