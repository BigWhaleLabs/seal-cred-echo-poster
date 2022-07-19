import { SlashCommandBuilder } from '@discordjs/builders'

export default function () {
  const command = new SlashCommandBuilder()
    .setName('tweet')
    .setDescription('Get info about a user or a server!')

  return command
}
