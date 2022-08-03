import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { TextChannel } from 'discord.js'

export default function (
  channel: TextChannel,
  embed: EmbedBuilder,
  components: ActionRowBuilder<ButtonBuilder>
) {
  return channel.send({
    embeds: [embed],
    components: [components],
  })
}
