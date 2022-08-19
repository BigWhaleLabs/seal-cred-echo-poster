import { TextChannel } from 'discord.js'
import discordClient from '@/helpers/discordClient'
import env from '@/helpers/env'
import logError from '@/helpers/logError'

export default function () {
  return discordClient.channels
    .fetch(env.DISCORD_ERROR_CHANNEL_ID)
    .then((channel) => {
      if (!channel || !(channel instanceof TextChannel)) {
        logError('Could not find Discord error channel')
        process.exit(1)
      }
      return channel
    })
}
