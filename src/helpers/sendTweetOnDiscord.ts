import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonStyle, Colors, TextChannel } from 'discord.js'
import getDerivativeDomain from '@/helpers/getDerivativeDomain'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function (
  channel: TextChannel,
  tweetId: number,
  derivativeAddress: string,
  tweet: string
) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve-${tweetId}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${tweetId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const domain = await getDerivativeDomain(derivativeAddress)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Tweet #${tweetId} from ${domain}`)
    .setDescription(tweet)
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (error) {
    console.error(
      'Error sending tweet on Discord',
      error instanceof Error ? error.message : error
    )
    await sendErrorOnDiscord(channel, error, 'sending tweet to Discord')
  }
}
