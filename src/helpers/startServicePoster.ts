import { Colors, EmbedBuilder } from 'discord.js'
import { DocumentType } from '@typegoose/typegoose'
import { Post, PostModel } from '@/models/Post'
import {
  SCPostStorage,
  SCPostStorage__factory,
} from '@big-whale-labs/seal-cred-posts-contract'
import filter = require('leo-profanity')
import Status from '@/models/Status'
import channels from '@/helpers/channels'
import data from '@/data'
import delay from '@/helpers/delay'
import getMessageFromError from '@/helpers/getMessageFromError'
import getSymbol from '@/helpers/getSymbol'
import isTwitterError from '@/helpers/isTwitterError'
import logError from '@/helpers/logError'
import provider from '@/helpers/provider'

async function postPost({
  contractAddress,
  blockchainId,
  postingService,
}: DocumentType<Post>) {
  let contract: SCPostStorage | undefined
  let post: string | undefined
  let derivativeAddress: string | undefined
  let postContent: string | undefined
  try {
    contract = SCPostStorage__factory.connect(contractAddress, provider)
    const fetchedPost = await contract.posts(blockchainId)
    post = fetchedPost.post
    derivativeAddress = fetchedPost.derivativeAddress
    const symbol = (await getSymbol(derivativeAddress)).slice(0, -2) // cut extra "-d"
    postContent = `${filter.clean(post)} @ ${symbol.split('.').join('\u2024')}` // replace dot with unicode character
    const postFunction = data.find(
      (datum) =>
        datum.contract === contractAddress && datum.type === postingService
    )?.post
    if (!postFunction) {
      throw new Error(
        `No post function found for ${postingService} and ${contractAddress}`
      )
    }
    const id = await postFunction(postContent)
    await PostModel.updateOne(
      {
        contractAddress,
        blockchainId,
        postingService,
      },
      { serviceId: id, status: Status.published }
    )
  } catch (error) {
    await PostModel.updateOne(
      {
        contractAddress,
        blockchainId,
        postingService,
      },
      { status: Status.rejected }
    )
    const message = getMessageFromError(error)
    const details = isTwitterError(error) ? error.data.detail : 'no details'
    const description = `${message} [${details}] for the post (blockchain id: ${blockchainId})${
      postContent ? `: \n\n${postContent}` : ''
    }`
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle(`Error posting on ${postingService} for ${derivativeAddress}`)
      .setDescription(description)
    try {
      await (
        await channels.error()
      ).send({
        embeds: [embed],
      })
    } catch (discordError) {
      logError('Sending error message to Discord', error)
    }
  }
}

let checking = false
async function checkPostsToBePosted() {
  if (checking) return
  checking = true
  console.log('Checking posts to be posted...')
  try {
    const postsToPost = await PostModel.find({
      status: Status.approved,
    })
    console.log(
      `Found ${postsToPost.length} posts to be posted that were approved...`
    )
    for (const post of postsToPost) {
      await postPost(post)
      await delay(2)
    }
  } catch (error) {
    console.error(
      'Error fetching pending posts',
      error instanceof Error ? error.message : error
    )
  } finally {
    checking = false
  }
}

export default function () {
  setInterval(() => checkPostsToBePosted(), 4 * 1000) // every 4 seconds
}
