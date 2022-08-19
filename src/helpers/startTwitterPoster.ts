import { Colors, EmbedBuilder } from 'discord.js'
import { DocumentType } from '@typegoose/typegoose'
import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import { Tweet, TweetModel } from '@/models/Tweet'
import filter = require('leo-profanity')
import Status from '@/models/Status'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'
import delay from '@/helpers/delay'
import getErrorChannel from '@/helpers/getErrorChannel'
import getMessageFromError from '@/helpers/getMessageFromError'
import getSymbol from '@/helpers/getSymbol'
import isTwitterError from '@/helpers/isTwitterError'
import logError from '@/helpers/logError'
import sendTweet from '@/helpers/sendTweet'

async function postTweet({ contractAddress, tweetId }: DocumentType<Tweet>) {
  let contract: SCPostStorage | undefined
  let post: string | undefined
  let derivativeAddress: string | undefined
  let tweetContent: string | undefined
  try {
    const contractAndTwitter = contractsAndTwitters.find(
      ({ contract }) => contract.address === contractAddress
    )
    if (!contractAndTwitter)
      throw new Error(`Could not find twitter for contract ${contractAddress}`)
    contract = contractAndTwitter.contract
    const { twitter } = contractAndTwitter
    const fetchedPost = await contract.posts(tweetId)
    post = fetchedPost.post
    derivativeAddress = fetchedPost.derivativeAddress
    const symbol = (await getSymbol(derivativeAddress)).slice(0, -2) // cut extra "-d"
    tweetContent = `${filter.clean(post)} @ ${symbol.split('.').join('\u2024')}` // replace dot with unicode character
    const {
      errors,
      data: { id },
    } = await sendTweet(tweetContent, twitter)
    if (errors && errors.length > 0) throw new Error(errors[0].reason)
    await TweetModel.updateOne(
      {
        contractAddress,
        tweetId,
      },
      { statusId: id, status: Status.published }
    )
  } catch (error) {
    await TweetModel.updateOne(
      {
        contractAddress,
        tweetId,
      },
      { status: Status.rejected }
    )
    const message = getMessageFromError(error)
    const details = isTwitterError(error) ? error.data.detail : 'no details'
    const description = `${message} [${details}] for the tweet (id: ${tweetId})${
      tweetContent ? `: \n\n${tweetContent}` : ''
    }`
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle(`Error posting on twitter for ${derivativeAddress}`)
      .setDescription(description)
    try {
      await (
        await getErrorChannel()
      ).send({
        embeds: [embed],
      })
    } catch (discordError) {
      logError('Sending error message to Discord', error)
    }
  }
}

let checking = false
async function checkTweetsToBePosted() {
  if (checking) return
  checking = true
  console.log('Checking tweets to be posted...')
  try {
    const tweetsToPost = await TweetModel.find({
      status: Status.approved,
    })
    console.log(
      `Found ${tweetsToPost.length} tweets to be posted that were approved...`
    )
    for (const tweet of tweetsToPost) {
      await postTweet(tweet)
      await delay(2)
    }
  } catch (error) {
    console.error(
      'Error fetching pending tweets',
      error instanceof Error ? error.message : error
    )
  } finally {
    checking = false
  }
}

export default function () {
  setInterval(() => checkTweetsToBePosted(), 4 * 1000) // every 4 seconds
}
