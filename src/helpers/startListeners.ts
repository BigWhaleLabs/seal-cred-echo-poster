import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendOnDiscord from '@/helpers/sendOnDiscord'

export default function (channel: TextChannel) {
  console.log('Start listeners')

  sealCredTwitterContract.on(
    sealCredTwitterContract.filters.TweetSaved(),
    async (tweetIdBigNumber, tweet, derivativeAddress) => {
      const tweetId = tweetIdBigNumber.toNumber()
      const tweetInMongo = await TweetModel.findOne({
        tweetId: tweetId,
      })
      if (!tweetInMongo) {
        console.log(`New Tweet: ${tweet}`)
        await TweetModel.create({
          tweetId: tweetId,
          status: Status.pending,
        })
        await sendOnDiscord(channel, tweetId, derivativeAddress, tweet)
      }
    }
  )
}
