import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { ButtonStyle, Colors, TextChannel } from 'discord.js'
import PostType from '@/models/PostType'
import isTwitterError from '@/helpers/isTwitterError'

export default async function (
  channel: TextChannel,
  error: unknown,
  extraTitle?: string,
  postDetails?: { id: number; postContent?: string; type: PostType }
) {
  const { id, postContent, type } = postDetails || {}

  const message = error instanceof Error ? error.message : error
  const details = isTwitterError(error) ? error.data.detail : 'no details'
  const content = postContent ? `: \n\n${postContent}` : ''
  const description = `${message} [${details}] for the tweet (id: ${id}, type: ${type})${content}`

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve-${id}`)
      .setLabel('Re-Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${id}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  )
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(extraTitle ? `Error: ${extraTitle}` : 'Error')
    .setDescription(description)
  try {
    await channel.send({
      embeds: [embed],
      components: postDetails ? [row] : undefined,
    })
  } catch (discordError) {
    console.error(
      'Error sending error message to Discord',
      discordError instanceof Error ? discordError.message : discordError
    )
  }
}
