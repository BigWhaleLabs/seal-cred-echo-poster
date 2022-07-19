import 'module-alias/register'
import 'source-map-support/register'

import { Client, Intents, TextChannel } from 'discord.js'
import { TweetModel, createTweetInMongo } from '@/models/Tweet'
import env from '@/helpers/env'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendOnDiscord from '@/helpers/sendOnDiscord'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  console.log('Checking twitter contract...')
  await checkTwitterContract()
  console.log('Checked twitter contract!')
  console.log('Starting listeners...')
  await startListeners()
  console.log('App started!')
  await runApp()
})()

async function checkTwitterContract() {
  console.log('Discord Bot is starting')
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  const channel = (await client.channels.fetch(
    '998676811728830595'
  )) as TextChannel
  console.log('hey')
  client.once('ready', () => {
    console.log('ready')
  })

  const tweetsFromContract = await sealCredTwitterContract.getAllTweets()
  console.log(
    `Got SealCredTwitter events! Tweet count: ${tweetsFromContract.length}`
  )
  tweetsFromContract.forEach(async (tweetOutput, index) => {
    const tweetInMongo = await TweetModel.findOne({
      tweetId: index,
    })

    if (!tweetInMongo) {
      await sendOnDiscord(
        channel,
        index,
        tweetOutput.derivativeAddress,
        tweetOutput.tweet
      )
      await createTweetInMongo(index)
    }
  })
  await client.login(env.DISCORD_BOT_TOKEN)
}

async function startListeners() {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  const channel = (await client.channels.fetch(
    '998676811728830595'
  )) as TextChannel

  sealCredTwitterContract.on(
    sealCredTwitterContract.filters.TweetSaved(),
    async (tweetIdBigNumber, tweet, derivativeAddress) => {
      console.log(`New Tweet: ${tweet}`)
      const tweetId = tweetIdBigNumber.toNumber()
      await sendOnDiscord(channel, tweetId, derivativeAddress, tweet)
    }
  )

  await client.login(env.DISCORD_BOT_TOKEN)
}
