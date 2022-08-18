import discordClient from '@/helpers/discordClient'
import env from '@/helpers/env'

export default function () {
  return new Promise<void>((resolve) => {
    discordClient.on('ready', () => resolve())
    void discordClient.login(env.DISCORD_BOT_TOKEN)
  })
}
