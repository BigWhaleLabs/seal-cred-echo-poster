import 'module-alias/register'
import 'source-map-support/register'

import { ButtonStyle, Client, Colors, TextChannel } from 'discord.js'
// import { TweetModel, createTweetInMongo } from '@/models/Tweet'
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders'
import { TweetModel } from 'src/models/Tweet'
import env from '@/helpers/env'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
// import sealCredTwitterContract from '@/helpers/twitterContract'
// import sendOnDiscord from '@/helpers/sendOnDiscord'

void (async () => {
  await runMongo()
  console.log('Mongo connected')
  console.log('Checking twitter contract...')
  await checkTwitterContract()
  console.log('Checked twitter contract!')
  console.log('Starting listeners...')
  // await startListeners()
  // await runApp()
  console.log('App started!')
})()

async function checkTwitterContract() {
  console.log('Discord Bot is starting')
  const client = new Client({
    intents: 1 << 9,
  })
  // const channel = (await client.channels.fetch(
  //   '998676811728830595'
  // )) as TextChannel
  client.once('ready', async () => {
    console.log('ready')
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`a~${tweetId}`)
        .setLabel('Approve')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('reject')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
    )
    const embed = new EmbedBuilder()
      .setColor(Colors.Default)
      .setTitle(`Someone tweeted`)
      .setDescription(`This is a tweet`)
    const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID)
    if (channel && 'send' in channel) {
      await channel.send({
        embeds: [embed],
        components: [row as any],
      })
      await interaction.editButton().setDisabled()
      await TweetModel.create({
        tweetId,
        derivativeAddress,
        status: Status.pending,
      })
      await TweetModel.updateOne(
        {
          tweetid,
        },
        {
          status: Status.rejected,
        }
      )
    } else {
      throw new Error('Text channel not found')
    }
  })
  //initial testing
  // client.on('messageCreate', async (message) => {
  //   if (message.content === 'ping') {
  //     await message.reply({ content: 'pong' })
  //   }
  // })
  // const tweetsFromContract = await sealCredTwitterContract.getAllTweets()
  // console.log(
  //   `Got SealCredTwitter events! Tweet count: ${tweetsFromContract.length}`
  // )
  // tweetsFromContract.forEach(async (tweetOutput, index) => {
  //   const tweetInMongo = await TweetModel.findOne({
  //     tweetId: index,
  //   })

  //   if (!tweetInMongo) {
  //     await sendOnDiscord(
  //       channel,
  //       index,
  //       tweetOutput.derivativeAddress,
  //       tweetOutput.tweet
  //     )
  //     await createTweetInMongo(index)
  //   }
  // })
  await client.login(env.DISCORD_BOT_TOKEN)
}

// async function startListeners() {
//   const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
//   const channel = (await client.channels.fetch(
//     '998676811728830595'
//   )) as TextChannel

//   sealCredTwitterContract.on(
//     sealCredTwitterContract.filters.TweetSaved(),
//     async (tweetIdBigNumber, tweet, derivativeAddress) => {
//       console.log(`New Tweet: ${tweet}`)
//       const tweetId = tweetIdBigNumber.toNumber()
//       await sendOnDiscord(channel, tweetId, derivativeAddress, tweet)
//     }
//   )

//   await client.login(env.DISCORD_BOT_TOKEN)
// }
