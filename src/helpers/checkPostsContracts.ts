import { PostModel } from '@/models/Post'
import { SCPostStorage__factory } from '@big-whale-labs/seal-cred-posts-contract'
import addPost from '@/helpers/addPost'
import data from '@/data'
import provider from '@/helpers/provider'

export default async function () {
  for (const {
    contract: contractAddress,
    moderationLevel,
    type: postingService,
  } of data) {
    const contractName = contractAddress + ' contract'
    const contract = SCPostStorage__factory.connect(contractAddress, provider)
    console.log(`Checking postss from the ${contractName}...`)
    const contractPostsLength = (await contract.currentPostId()).toNumber()
    console.log(`Got posts length from ${contractName}: ${contractPostsLength}`)
    for (
      let blockchainId = 0;
      blockchainId < contractPostsLength;
      blockchainId++
    ) {
      // Check if post exists
      const post = await PostModel.findOne({
        blockchainId,
        contractAddress: contract.address,
        postingService,
      })
      if (post) continue

      await addPost(blockchainId, postingService, moderationLevel, contract)
    }
    console.log(`Checked posts from the ${contractName}`)
  }
}
