import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default function (channel: TextChannel) {
  console.log('Starting contract listener...')
  sealCredTwitterContract.on(
    sealCredTwitterContract.filters.TweetSaved(),
    async (tweetIdBigNumber, text, derivativeAddress) => {
      const tweetId = tweetIdBigNumber.toNumber()
      const tweet = await TweetModel.findOne({
        tweetId,
      })
      if (tweet) {
        return
      }
      try {
        await sendTweetOnDiscord(channel, tweetId, derivativeAddress, text)
      } catch (error) {
        console.error(
          'Error posting tweet on Discrod',
          error instanceof Error ? error.message : error
        )
      }
      await TweetModel.create({
        tweetId,
      })
    }
  )
  console.log('Started contract listener')
}
