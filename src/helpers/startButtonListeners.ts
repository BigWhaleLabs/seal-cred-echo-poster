import { ButtonInteraction } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import getChannel from '@/helpers/getChannel'
import sendPostReviewOnDiscord from '@/helpers/sendPostReviewOnDiscord'

export default async function () {
  const channel = await getChannel()
  const collector = channel.createMessageComponentCollector({
    filter: (message) => RegExp(`(a|r)-.+-\\d+`, 'gi').test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    const isApprove = interaction.customId.startsWith('a')
    // TODO: add a status whether we approved it or rejected + the name of the reviewer
    await interaction.message.edit({
      components: [],
    })
    const components = interaction.customId.split('-')
    const contractAddress = components[1]
    const blockchainId = parseInt(components[2])
    await TweetModel.updateOne(
      {
        contractAddress,
        blockchainId,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
    const discordUsername = interaction.user.username
    await sendPostReviewOnDiscord({ blockchainId, isApprove, discordUsername })
  })
}
