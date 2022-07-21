import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import startDiscordBot from '@/helpers/startDiscordBot'

void (async () => {
  console.log('Connecting to mongo...')
  await runMongo()
  console.log('Connected to mongo')
  console.log('Starting discord bot...')
  await startDiscordBot()
  console.log('Discord bot started')
  console.log('Starting app...')
  await runApp()
  console.log('App started')
})()
