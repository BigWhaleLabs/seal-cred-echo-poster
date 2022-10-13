import { PostModel } from '@/models/Post'
import { SCPostStorage__factory } from '@big-whale-labs/seal-cred-posts-contract'
import addPost from '@/helpers/addPost'
import data from '@/data'
import provider from '@/helpers/provider'

export default function () {
  for (const {
    contract: contractAddress,
    type: postingService,
    moderationLevel,
  } of data) {
    const contract = SCPostStorage__factory.connect(contractAddress, provider)
    const contractName = contractAddress + ' contract'
    console.log(`Starting ${contractName} listener...`)
    contract.on(contract.filters.PostSaved(), async (id) => {
      const blockchainId = id.toNumber() - 1
      // Check if it exists
      const post = await PostModel.findOne({
        blockchainId,
        contractAddress: contract.address,
        postingService,
      })
      if (post) return
      // Add to database
      await addPost(blockchainId, postingService, moderationLevel, contract)
    })
  }
}
