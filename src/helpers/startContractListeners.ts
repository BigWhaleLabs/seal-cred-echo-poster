import { TweetModel } from '@/models/Tweet'
import addPost from '@/helpers/addPost'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'

export default function () {
  const contracts = contractsAndTwitters.map(({ contract }) => contract)
  for (const contract of contracts) {
    const contractName = contract.address + ' contract'
    console.log(`Starting ${contractName} listener...`)
    contract.on(contract.filters.PostSaved(), async (blockchainIdBigNumber) => {
      const blockchainId = blockchainIdBigNumber.toNumber()
      // Check if it exists
      const tweet = await TweetModel.findOne({
        blockchainId,
        contractAddress: contract.address,
      })
      if (tweet) return
      // Add to database
      await addPost(blockchainId, contract.address)
    })
  }
}
