import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'

export default async function (
  channel: TextChannel,
  error: unknown,
  extraTitle?: string
) {
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(`Error${extraTitle ? `: ${extraTitle}` : ''}`)
    .setDescription(`${error instanceof Error ? error.message : error}`)
  try {
    await channel.send({
      embeds: [embed],
    })
  } catch (discordError) {
    console.error(
      'Error sending error message to Discord',
      discordError instanceof Error ? discordError.message : discordError
    )
  }
}
