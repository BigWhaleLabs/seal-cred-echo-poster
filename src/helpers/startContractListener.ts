import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import handleError from '@/helpers/handleError'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default function (channel: TextChannel, contract: SCPostStorage) {
  const contractName = contract.address + ' contract'
  console.log(`Starting ${contractName} listener...`)
  contract.on(
    contract.filters.PostSaved(),
    async (tweetIdBigNumber, text, derivativeAddress) => {
      const tweetId = tweetIdBigNumber.toNumber()
      const tweet = await TweetModel.findOne({
        tweetId,
        contractAddress: contract.address,
      })
      if (tweet) return

      try {
        await sendTweetOnDiscord({
          channel,
          tweetId,
          derivativeAddress,
          tweet: text,
        })
      } catch (error) {
        handleError(
          `Error posting tweet from ${contractName} on Discord`,
          error
        )
      }
      await TweetModel.create({
        tweetId,
        contractAddress: contract.address,
      })
    }
  )
  console.log(`Started ${contractName} listener`)
}
