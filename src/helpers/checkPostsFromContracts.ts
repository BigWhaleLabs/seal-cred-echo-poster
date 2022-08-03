import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
} from '@/helpers/postsContracts'
import PostType from '@/models/PostType'
import sendPostToDiscord from '@/helpers/sendPostToDiscord'

export default function (channel: TextChannel) {
  return Promise.all(
    Object.keys(PostType).map(async (type) => {
      const contractName = `${type}PostsContract`

      console.log(`Checking posts from the ${contractName} contract...`)
      const postsFromContract =
        type === PostType.email
          ? await scEmailPostsContract.getAllPosts()
          : await scErc721PostsContract.getAllPosts()
      console.log(
        `Got posts from ${contractName} smart contract, count: ${postsFromContract.length}`
      )

      for (let id = 0; id < postsFromContract.length; id++) {
        const { post: text, derivativeAddress } = postsFromContract[id]
        const post = await PostModel.findOne({
          id,
        })
        if (post) return

        try {
          await sendPostToDiscord(
            channel,
            id,
            PostType.email,
            derivativeAddress,
            text
          )
        } catch (error) {
          console.error(
            `Error posting ${contractName} post on Discord`,
            error instanceof Error ? error.message : error
          )
        }
        await PostModel.create({
          id,
          type,
        })
        console.log(`Checked posts from the ${contractName} contract`)
      }
    })
  )
}
