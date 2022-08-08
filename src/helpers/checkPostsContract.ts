import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import handleError from '@/helpers/handleError'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default async function (
  channel: TextChannel,
  postStorage: SCPostStorage
) {
  const contractName = postStorage.address + ' contract'
  console.log(`Checking tweets from the ${contractName}...`)
  const tweetsFromContract = await postStorage.getAllPosts()
  console.log(
    `Got tweets from smart ${contractName}, count: ${tweetsFromContract.length}`
  )
  for (let tweetId = 0; tweetId < tweetsFromContract.length; tweetId++) {
    const { post: text, derivativeAddress } = tweetsFromContract[tweetId]
    const tweet = await TweetModel.findOne({
      contractAddress: postStorage.address,
      tweetId,
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
      handleError(`Error posting tweet from ${contractName} on Discord`, error)
    }
    await TweetModel.create({
      contractAddress: postStorage.address,
      tweetId,
    })
  }
  console.log(`Checked tweets from the ${contractName}`)
}
