import { TweetModel } from '@/models/Tweet'
import addPost from '@/helpers/addPost'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'

export default function () {
  const contracts = contractsAndTwitters.map(({ contract }) => contract)
  for (const contract of contracts) {
    const contractName = contract.address + ' contract'
    console.log(`Starting ${contractName} listener...`)
    contract.on(contract.filters.PostSaved(), async (tweetIdBigNumber) => {
      const tweetId = tweetIdBigNumber.toNumber()
      // Check if it exists
      const tweet = await TweetModel.findOne({
        tweetId,
        contractAddress: contract.address,
      })
      if (tweet) return
      // Add to database
      await addPost(tweetId, contract.address)
    })
  }
}
