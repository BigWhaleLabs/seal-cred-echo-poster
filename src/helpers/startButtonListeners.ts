import { ButtonInteraction } from 'discord.js'
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
      // TODO: add a status whether we approved it or rejected + the name of the reviewer
      await interaction.message.edit({
        components: [],
      })
      const components = interaction.customId.split('-')
      const contractAddress = components[1]
      const blockchainId = parseInt(components[2])
      const postingService = components[3] as PostingService
      await PostModel.updateOne(
        {
          contractAddress,
          blockchainId,
          postingService,
        },
        { status: isApprove ? Status.approved : Status.rejected }
      )
    })
  }
}
