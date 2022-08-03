import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import {
  SC_EMAIL_POSTS_CONTRACT_ADDRESS,
  SC_EXTERNAL_NFT_POSTS_CONTRACT_ADDRESS,
  SC_NFT_POSTS_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import checkPostsContract from '@/helpers/checkPostsContract'
import env from '@/helpers/env'
import getSCPostStorageContract from '@/helpers/getSCPostStorageContract'
import startButtonListener from '@/helpers/startButtonListener'
import startContractListener from '@/helpers/startContractListener'

export default function () {
  const client = new Client({
    intents: GatewayIntentBits.GuildMessages,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    const contracts = [
      getSCPostStorageContract(SC_EMAIL_POSTS_CONTRACT_ADDRESS),
      getSCPostStorageContract(SC_NFT_POSTS_CONTRACT_ADDRESS),
      getSCPostStorageContract(SC_EXTERNAL_NFT_POSTS_CONTRACT_ADDRESS),
    ]
    if (channel && channel instanceof TextChannel) {
      for (const contract of contracts) {
        await checkPostsContract(channel, contract)
        startButtonListener(channel, contract)
        startContractListener(channel, contract)
      }
    } else {
      console.error('Could not find Discord channel')
    }
  })

  return client.login(env.DISCORD_BOT_TOKEN)
}
