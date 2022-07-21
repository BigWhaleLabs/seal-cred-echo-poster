import { Client, TextChannel } from 'discord.js'
import checkTwitterContract from '@/helpers/checkTwitterContract'
import env from '@/helpers/env'
import startListeners from '@/helpers/startListeners'

export default async function () {
  const client = new Client({
    intents: 1 << 9,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    if (channel && channel instanceof TextChannel) {
      await checkTwitterContract(channel)
      startListeners(channel)
    }
  })

  await client.login(env.DISCORD_BOT_TOKEN)
}
