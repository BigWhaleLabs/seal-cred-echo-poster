import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import {
  checkScEmailPostsContract,
  checkScErc721PostsContract,
} from '@/helpers/checkPostsContracts'
import env from '@/helpers/env'
import startButtonListener from '@/helpers/startButtonListener'
import startContractListener from '@/helpers/startContractsListener'

export default function () {
  const client = new Client({
    intents: GatewayIntentBits.GuildMessages,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    if (channel && channel instanceof TextChannel) {
      await checkScErc721PostsContract(channel)
      await checkScEmailPostsContract(channel)
      startButtonListener(channel)
      startContractListener(channel)
    } else {
      console.error('Could not find Discord channel')
    }
  })

  return client.login(env.DISCORD_BOT_TOKEN)
}
