import 'module-alias/register'
import 'source-map-support/register'

import { Client, Intents } from 'discord.js'
import { Tweet, TweetModel } from '@/models/Tweet'
// import button from '@/helpers/button'
import env from '@/helpers/env'
import ready from '@/helpers/ready'
import runMongo from '@/helpers/mongo'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendOnDiscord from '@/helpers/sendOnDiscord'
// import signer from '@/helpers/signer'
// import wallet from '@/helpers/wallet'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  await startDiscordBot()
  console.log('BWL Discord Bot Started')
  console.log('Checking twitter contract...')
  await checkTwitterContract()
  console.log('Checked twitter contract!')
  console.log('Starting listeners...')
  startListeners()
  console.log('App started!')
})()

async function startDiscordBot() {
  const token = env.DISCORD_BOT_TOKEN
  console.log('Discord Bot is starting')
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

  client.once('ready', () => {
    console.log('ready')
  })

  ready(client)
  await client.login(token)
}

async function checkTwitterContract() {
  let tweetsFromContract = [] as Tweet[]
  const erc721Filter = sealCredTwitterContract.filters.TweetSaved()
  const erc721Events = await sealCredTwitterContract.queryFilter(erc721Filter)
  tweetsFromContract = erc721Events.map((e) => {
    const t = new Tweet()
    t.derivativeAddress = e.args.derivativeAddress
    t.tweet = e.args.tweet
    return t
  })
  console.log(
    `Got SealCredTwitter events! Tweet count: ${tweetsFromContract.length}`
  )

  //check if these tweets have status on mongo
  /**1. approved
   * 2. rejected
   * 3. pending
   * 4. not in mongo
   */
  tweetsFromContract.forEach(async (savedTweet) => {
    const tweet = await TweetModel.findOne({
      tweet: savedTweet.tweet,
      derivativeAddress: savedTweet.derivativeAddress,
    })
    // !tweet && (await sendOnDiscord())
  })

  //if not in mongo, post them on discord and put status as pending
  console.log('Getting SealCredTwitter events...')
}

function startListeners() {
  sealCredTwitterContract.on(
    sealCredTwitterContract.filters.TweetSaved(),
    (_, tweetSaved) => {
      console.log(`New Tweet: ${tweetSaved}`)
      // await sendOnDiscord(tweetSaved)
    }
  )
}
