import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonStyle, Colors, TextChannel } from 'discord.js'
import getSymbol from '@/helpers/getSymbol'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function (
  channel: TextChannel,
  tweetId: number,
  derivativeAddress: string,
  tweet: string
) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${derivativeAddress}-${tweetId}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${derivativeAddress}-${tweetId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const symbol = await getSymbol(derivativeAddress)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Tweet #${tweetId} from ${symbol}`)
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
