import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default async function (
  channel: TextChannel,
  postStorage: SCPostStorage
) {
  console.log('Checking tweets from the contract...')
  const tweetsFromContract = await postStorage.getAllPosts()
  console.log(
    `Got tweets from smart contract, count: ${tweetsFromContract.length}`
  )
  for (let i = 0; i < tweetsFromContract.length; i++) {
    const { post: text, derivativeAddress } = tweetsFromContract[i]
    const tweet = await TweetModel.findOne({
      contractAddress: postStorage.address,
      tweetId: i,
    })
    if (tweet) {
      return
    }
    try {
      await sendTweetOnDiscord(channel, i, derivativeAddress, text)
    } catch (error) {
      console.error(
        'Error posting tweet on Discrod',
        error instanceof Error ? error.message : error
      )
    }
    await TweetModel.create({
      contractAddress: postStorage.address,
      tweetId: i,
    })
  }
  console.log('Checked tweets from the contract')
}
