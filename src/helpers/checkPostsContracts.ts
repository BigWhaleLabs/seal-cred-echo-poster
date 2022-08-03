import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import PostType from '@/models/PostType'
import sendPostOnDiscord from '@/helpers/sendPostOnDiscord'

export async function checkScErc721PostsContract(channel: TextChannel) {
  console.log('Checking tweets from the contract...')
  const postsFromContract = await scErc721PostsContract.getAllPosts()
  console.log(
    `Got tweets from SCERC721Posts smart contract, count: ${postsFromContract.length}`
  )

  for (let id = 0; id < postsFromContract.length; id++) {
    const { post: text, derivativeAddress } = postsFromContract[id]
    const post = await PostModel.findOne({
      id,
    })
    if (post) return

    try {
      await sendPostOnDiscord(
        channel,
        id,
        PostType.erc721,
        derivativeAddress,
        text
      )
    } catch (error) {
      console.error(
        'Error posting SCERC721 tweet on Discord',
        error instanceof Error ? error.message : error
      )
    }
    await PostModel.create({
      id,
      type: PostType.erc721,
    })
  }
  console.log('Checked tweets from the SCERC721Posts contract')
}

export async function checkScEmailPostsContract(channel: TextChannel) {
  console.log('Checking tweets from the contract...')
  const postsFromContract = await scEmailPostsContract.getAllPosts()
  console.log(
    `Got tweets from SCEmailPosts smart contract, count: ${postsFromContract.length}`
  )

  for (let id = 0; id < postsFromContract.length; id++) {
    const { post: text, derivativeAddress } = postsFromContract[id]
    const post = await PostModel.findOne({
      id,
    })
    if (post) return

    try {
      await sendPostOnDiscord(
        channel,
        id,
        PostType.email,
        derivativeAddress,
        text
      )
    } catch (error) {
      console.error(
        'Error posting SCEmail tweet on Discord',
        error instanceof Error ? error.message : error
      )
    }
    await PostModel.create({
      id,
      type: PostType.email,
    })
  }
  console.log('Checked tweets from the SCEmailPosts contract')
}
