import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import startDiscordBot from '@/helpers/startDiscordBot'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  console.log('Starting discord bot...')
  await startDiscordBot()
  console.log('Discord bot started')
  await runApp()
  console.log('App started!')
})()
