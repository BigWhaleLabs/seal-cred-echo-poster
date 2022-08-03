import { PostModel } from '@/models/Post'
import { TextChannel } from 'discord.js'
import {
  scEmailPostsContract,
  scErc721PostsContract,
  scExternalErc721PostsContract,
} from '@/helpers/postsContracts'
import ContractType from '@/models/ContractType'
import handleError from '@/helpers/handleError'
import sendPostToDiscord from '@/helpers/sendPostToDiscord'

function getAllPostsFromContract(type: ContractType) {
  if (type === ContractType.email) return scEmailPostsContract.getAllPosts()
  if (type === ContractType.erc721) return scErc721PostsContract.getAllPosts()
  return scExternalErc721PostsContract.getAllPosts()
}

export default function (channel: TextChannel) {
  return Promise.all(
    Object.values(ContractType).map(async (type) => {
      const contractName = `${type}PostsContract`

      console.log(`Checking posts from the ${contractName} contract...`)
      const postsFromContract = await getAllPostsFromContract(type)
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
            ContractType.email,
            derivativeAddress,
            text
          )
        } catch (error) {
          handleError(`Error posting ${contractName} post on Discord`, error)
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
