import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import checkPostsFromContracts from '@/helpers/checkPostsFromContracts'
import env from '@/helpers/env'
import startButtonListener from '@/helpers/startButtonListener'
import startContractListener from '@/helpers/startContractsListener'

export default function () {
  const client = new Client({
    intents: GatewayIntentBits.GuildMessages,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    if (!channel || !(channel instanceof TextChannel))
      return console.error('Could not find Discord channel')

    await checkPostsFromContracts(channel)
    startButtonListener(channel)
    startContractListener(channel)
  })

  return client.login(env.DISCORD_BOT_TOKEN)
}
