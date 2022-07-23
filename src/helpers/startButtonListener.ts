import { ButtonInteraction, TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import getDerivativeDomain from '@/helpers/getDerivativeDomain'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import sendTweet from '@/helpers/sendTweet'
import twitterContract from '@/helpers/twitterContract'

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
    const tweetId = parseInt(interaction.customId.split('-')[1])
    await TweetModel.updateOne(
      {
        tweetId: tweetId,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
    if (isApprove) {
      const { tweet, derivativeAddress } = await twitterContract.tweets(tweetId)
      const domain = (await getDerivativeDomain(derivativeAddress))
        .replace(' email', '')
        .replace('@', '')
      const tweetContent = `${tweet} #${domain}`
      try {
        const sentTweet = await sendTweet(tweetContent)
        if (sentTweet.errors && sentTweet.errors.length > 0) {
          throw new Error(sentTweet.errors[0].reason)
        }
        await TweetModel.updateOne(
          {
            tweetId: tweetId,
          },
          { statusId: sentTweet.data.id }
        )
      } catch (error) {
        await sendErrorOnDiscord(channel, error, 'tweeting')
        console.error(
          'Error sending tweet:',
          error instanceof Error ? error.message : error
        )
      }
    }
  })
  console.log('Started Discord button listener')
}
