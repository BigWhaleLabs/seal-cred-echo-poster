import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import checkPostsContract from '@/helpers/checkPostsContract'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'
import env from '@/helpers/env'
import startButtonListener from '@/helpers/startButtonListener'
import startContractListener from '@/helpers/startContractListener'

export default function () {
  const client = new Client({
    intents: GatewayIntentBits.GuildMessages,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    if (channel && channel instanceof TextChannel) {
      for (const { contract, twitter } of contractsAndTwitters) {
        await checkPostsContract(channel, contract)
        startButtonListener(channel, contract, twitter)
        startContractListener(channel, contract)
      }
    } else {
      console.error('Could not find Discord channel')
    }
  })

  return client.login(env.DISCORD_BOT_TOKEN)
}
