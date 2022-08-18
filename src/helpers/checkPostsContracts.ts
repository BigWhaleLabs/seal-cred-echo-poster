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
    for (let tweetId = 0; tweetId < contractPostsLength; tweetId++) {
      // Check if tweet exists
      const tweet = await TweetModel.findOne({
        contractAddress: contract.address,
        tweetId,
      })
      if (tweet) continue

      await addPost(tweetId, contract.address)
    }
    console.log(`Checked tweets from the ${contractName}`)
  }
}
