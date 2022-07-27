import { ButtonStyle, Colors, TextChannel } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'

export default async function (
  channel: TextChannel,
  error: unknown,
  extraTitle?: string,
  tweetDetails?: { tweetId: number; tweetContent?: string }
) {
  const { tweetId, tweetContent } = tweetDetails || {}
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve-${tweetId}`)
      .setLabel('Re-Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${tweetId}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(`Error${extraTitle ? `: ${extraTitle}` : ''}`)
    .setDescription(
      `${
        error instanceof Error ? error.message : error
      } for the tweet (id: ${tweetId})${
        tweetContent ? `: \n\n${tweetContent}` : ''
      }`
    )
  try {
    await channel.send({
      embeds: [embed],
      components: tweetDetails ? [row] : undefined,
    })
  } catch (discordError) {
    console.error(
      'Error sending error message to Discord',
      discordError instanceof Error ? discordError.message : discordError
    )
  }
}
