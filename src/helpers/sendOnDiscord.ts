import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonInteraction, ButtonStyle, Channel, Colors } from 'discord.js'
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
      .setCustomId(`approve-${tweetId}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${tweetId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`TweetId #${tweetId} from ${derivativeAddress}`)
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
    collector.on('collect', async (i: ButtonInteraction) => {
      if (i.customId === `approve-${tweetId}`) {
        const tweetContent = `${derivativeAddress} tweeted \n${tweet}`
        await approveHandler(tweetId, tweetContent)
      }
      if (i.customId === `reject-${tweetId}`) {
        await rejectHandler(tweetId)
      }
    })
  } else {
    throw new Error('Text channel not found')
  }
}
