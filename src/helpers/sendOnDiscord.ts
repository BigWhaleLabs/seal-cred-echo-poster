import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonStyle, Channel, Colors } from 'discord.js'
import approveHandler from '@/helpers/approveHandler'
import rejectHandler from '@/helpers/rejectHandler'

export default async function (
  channel: Channel,
  tweetId: number,
  derivativeAddress: string,
  tweet: string
) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('approve')
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('reject')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Tweet from ${derivativeAddress}`)
    .setDescription(`${tweet}`)

  if (channel && 'send' in channel) {
    await channel.send({
      embeds: [embed],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components: [row as any],
    })

    const collector = channel.createMessageComponentCollector({
      max: 1,
    })
    collector.on('end', async (collection) => {
      collection.forEach((click) => {
        console.log(`${click.user.id} ${click.customId}s this post.`)
      })

      if (collection.first()?.customId === 'approve') {
        const tweetContent = `${derivativeAddress} tweeted \n${tweet}`
        await approveHandler(tweetId, tweetContent)
      }
      if (collection.first()?.customId === 'reject') {
        await rejectHandler(tweetId)
      }
    })
  } else {
    throw new Error('Text channel not found')
  }
}
