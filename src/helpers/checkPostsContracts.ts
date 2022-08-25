import { TweetModel } from '@/models/Tweet'
import addPost from '@/helpers/addPost'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'

export default async function () {
  const contracts = contractsAndTwitters.map(({ contract }) => contract)
  for (const contract of contracts) {
    const contractName = contract.address + ' contract'
    console.log(`Checking tweets from the ${contractName}...`)
    const contractPostsLength = (await contract.currentPostId()).toNumber()
    console.log(`Got posts length from ${contractName}: ${contractPostsLength}`)
    for (
      let blockchainId = 0;
      blockchainId < contractPostsLength;
      blockchainId++
    ) {
      // Check if post exists
      const tweet = await TweetModel.findOne({
        contractAddress: contract.address,
        blockchainId,
      })
      if (tweet) continue

      await addPost(blockchainId, contract.address)
    }
    console.log(`Checked tweets from the ${contractName}`)
  }
}
