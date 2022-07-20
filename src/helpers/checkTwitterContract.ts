import { Channel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendOnDiscord from '@/helpers/sendOnDiscord'

export default async function (channel: Channel) {
  console.log('Checking twitter contracts...')

  const tweetsFromContract = await sealCredTwitterContract.getAllTweets()
  console.log(
    `Got SealCredTwitter events! Tweet count: ${tweetsFromContract.length}`
  )
  if (channel && 'send' in channel) {
    tweetsFromContract.forEach(async (tweetOutput, index) => {
      const tweetInMongo = await TweetModel.findOne({
        tweetId: index,
      })
      if (tweetInMongo && tweetInMongo.status === Status.pending) {
        await sendOnDiscord(
          channel,
          index,
          tweetOutput.derivativeAddress,
          tweetOutput.tweet
        )
      }
      if (!tweetInMongo) {
        await TweetModel.create({
          tweetId: index,
          status: Status.pending,
        })
        await sendOnDiscord(
          channel,
          index,
          tweetOutput.derivativeAddress,
          tweetOutput.tweet
        )
      }
    })
  }
  console.log('Checked twitter contract!')
}
