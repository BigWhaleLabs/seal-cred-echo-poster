import 'module-alias/register'
import 'source-map-support/register'

// import { Client } from 'discord.js'
import { Tweet } from '@/models/Tweet'
// import button from '@/helpers/button'
// import env from '@/helpers/env'
// import ready from '@/helpers/ready'
// import runMongo from '@/helpers/mongo'
import sealCredTwitterContract from '@/helpers/twitterContract'
// import signer from '@/helpers/signer'
// import wallet from '@/helpers/wallet'

void (async () => {
  // await runMongo()
  console.log('Mongo connected')
  // await startDiscordBot()
  console.log('BWL Discord Bot Started')
  console.log('Checking twitter contract...')
  await checkTwitterContract()
  console.log('Checked twitter contract!')
  console.log('Starting listeners...')
  // startListeners()
  console.log('App started!')
})()

// async function startDiscordBot() {
//   const token = env.DISCORD_BOT_TOKEN
//   console.log('Discord Bot is starting')
//   const client = new Client({ intents: [] })

//   client.on('interactionCreate', button)

//   ready(client)
//   await client.login(token)
//   console.log(client)
// }

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
  // tweetsFromContract.forEach((savedTweet) => {
  //   await TweetModel.findOne({ tweetId: savedTweet.tweetId })
  //   discordPost()
  // })

  //!(mongo find savedTweet.tweetId)
  //then, post on discord, set as pending, save to mongo

  //fetch contracts from mongo

  //if not in mongo, post them on discord and put status as pending

  //fetch from contract

  console.log('Getting SealCredTwitter events...')
}

// function startListeners() {
//   sealCredTwitterContract.on(
//     sealCredTwitterContract.filters.CreateDerivativeContract(),
//     async (_, derivativeContract) => {
//       console.log(
//         `New derivative token (ExternalERC721): ${derivativeContract}`
//       )
//       await addToVerifiedHolder(derivativeContract)
//     }
//   )
// }
