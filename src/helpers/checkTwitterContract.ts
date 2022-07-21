import { TextChannel } from 'discord.js'
import { TweetModel } from '@/models/Tweet'
import sealCredTwitterContract from '@/helpers/twitterContract'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default async function (channel: TextChannel) {
  console.log('Checking tweets from the contract...')
  const tweetsFromContract = await sealCredTwitterContract.getAllTweets()
  console.log(
    `Got tweets from smart contract, count: ${tweetsFromContract.length}`
  )
  for (let i = 0; i < tweetsFromContract.length; i++) {
    const { tweet: text, derivativeAddress } = tweetsFromContract[i]
    const tweet = await TweetModel.findOne({
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
      tweetId: i,
    })
  }
  console.log('Checked tweets from the contract')
}
