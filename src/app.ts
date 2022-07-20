import 'module-alias/register'
import 'source-map-support/register'

import { Client } from 'discord.js'
import checkTwitterContract from '@/helpers/checkTwitterContract'
import env from '@/helpers/env'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import startListeners from '@/helpers/startListeners'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  console.log('Starting discord bot...')
  await startDiscordBot()
  await runApp()
  console.log('App started!')
})()

async function startDiscordBot() {
  const client = new Client({
    intents: 1 << 9,
  })
  client.on('ready', async () => {
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)

    if (channel && 'send' in channel) {
      await checkTwitterContract(channel)
      startListeners(channel)
    }
  })

  await client.login(env.DISCORD_BOT_TOKEN)
}
