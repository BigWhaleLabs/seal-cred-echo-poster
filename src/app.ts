import 'module-alias/register'
import 'source-map-support/register'

import runMongo from '@/helpers/mongo'
import runServer from '@/helpers/runServer'
import startDiscordBot from '@/helpers/startDiscordBot'

void (async () => {
  console.log('Connecting to mongo...')
  await runMongo()
  console.log('Connected to mongo')
  console.log('Starting discord bot...')
  await startDiscordBot()
  console.log('Discord bot started')
  console.log('Starting app...')
  await runServer()
  console.log('App started')
})()
