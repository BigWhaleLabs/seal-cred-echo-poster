import { ButtonInteraction, TextChannel } from 'discord.js'
import { PostModel } from '@/models/Post'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import Status from '@/models/Status'
import getDerivativeDomain from '@/helpers/getDerivativeDomain'
import getEnsName from '@/helpers/getEnsName'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import sendTweet from '@/helpers/sendTweet'

// TODO: what if both contracts have this id?
const getTweetContentFromId = async (id: number) => {
  const { post, derivativeAddress } = await scEmailPostsContract.posts(id)
  if (post) {
    const domain = (await getDerivativeDomain(derivativeAddress))
      .replace(' email', '')
      .replace('@', '')
    return `${post} @ ${domain}.replace('.', '\u2024')`
  }
  const { post: erc721Post, derivativeAddress: erc721Derivative } =
    await scErc721PostsContract.posts(id)

  const derivativeEns = getEnsName(erc721Derivative)
  return `${erc721Post} @ ${derivativeEns}`
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
    if (!isApprove) return

    const tweetContent = await getTweetContentFromId(id)
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
