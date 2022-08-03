import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default function (channel: TextChannel, contract: SCPostStorage) {
  console.log('Starting contract listener...')
  contract.on(
    contract.filters.PostSaved(),
    async (tweetIdBigNumber, text, derivativeAddress) => {
      const tweetId = tweetIdBigNumber.toNumber()
      const tweet = await TweetModel.findOne({
        tweetId,
        contractAddress: contract.address,
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
        contractAddress: contract.address,
      })
    }
  )
  console.log('Started contract listener')
}
