import { ButtonInteraction } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import getChannel from '@/helpers/getChannel'

export default async function () {
  const channel = await getChannel()
  const collector = channel.createMessageComponentCollector({
    filter: (message) => RegExp(`(a|r)-.+-\\d+`, 'gi').test(message.customId),
  })
  collector.on('collect', async (interaction: ButtonInteraction) => {
    const isApprove = interaction.customId.startsWith('a')
    const discordUsername = interaction.user.username
    const components = interaction.customId.split('-')
    const contractAddress = components[1]
    const blockchainId = parseInt(components[2])
    const embed = new EmbedBuilder()
      .setColor(interaction.message.embeds[0].color)
      .setTitle(interaction.message.embeds[0].title)
      .setDescription(
        interaction.message.embeds[0].description +
          `\n\n${isApprove ? 'Approved' : 'Rejected'}by ${discordUsername}`
      )
    await interaction.message.edit({
      embeds: [embed],
      components: [],
    })
    await TweetModel.updateOne(
      {
        contractAddress,
        blockchainId,
      },
      { status: isApprove ? Status.approved : Status.rejected }
    )
  })
}
