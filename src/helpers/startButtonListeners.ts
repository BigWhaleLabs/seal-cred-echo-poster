import { ButtonInteraction } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import { PostModel } from '@/models/Post'
import PostingService from '@/models/PostingService'
import Status from '@/models/Status'
import typeToChannel from '@/helpers/typeToChannel'

export default async function () {
  const fetchedChannels = await Promise.all(
    Object.values(typeToChannel).map((f) => f())
  )
  for (const channel of fetchedChannels) {
    const collector = channel.createMessageComponentCollector({
      filter: (message) =>
        RegExp(`(a|r)-.+-\\d+-.+`, 'gi').test(message.customId),
    })
    collector.on('collect', async (interaction: ButtonInteraction) => {
      const isApprove = interaction.customId.startsWith('a')
      const discordUsername = interaction.user.username
      const components = interaction.customId.split('-')
      const contractAddress = components[1]
      const blockchainId = parseInt(components[2])
      const postingService = components[3] as PostingService
      const embed = new EmbedBuilder()
        .setColor(interaction.message.embeds[0].color)
        .setTitle(interaction.message.embeds[0].title)
        .setDescription(
          interaction.message.embeds[0].description +
            `\n\n${isApprove ? 'Approved' : 'Rejected'} by ${discordUsername}`
        )
      await interaction.message.edit({
        components: [],
        embeds: [embed],
      })
      await PostModel.updateOne(
        {
          blockchainId,
          contractAddress,
          postingService,
        },
        { status: isApprove ? Status.approved : Status.rejected }
      )
    })
  }
}
