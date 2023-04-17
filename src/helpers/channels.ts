import { TextChannel } from 'discord.js'
import discordClient from '@/helpers/discordClient'
import env from '@/helpers/env'
import logError from '@/helpers/logError'

function getChannel(channelId: string) {
  return discordClient.channels.fetch(channelId).then((channel) => {
    if (!channel || !(channel instanceof TextChannel)) {
      logError('Could not find Discord channel')
      process.exit(1)
    }
    return channel
  })
}

export default {
  error() {
    return getChannel(env.DISCORD_ERROR_CHANNEL_ID)
  },
  farcaster() {
    return getChannel(env.DISCORD_FARCASTER_CHANNEL_ID)
  },
  twitter() {
    return getChannel(env.DISCORD_TWITTER_CHANNEL_ID)
  },
}
