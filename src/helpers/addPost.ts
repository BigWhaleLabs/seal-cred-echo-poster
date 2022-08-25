import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'
import logError from '@/helpers/logError'
import messageFilters from '@/helpers/messageFilters'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

export default async function (blockchainId: number, contractAddress: string) {
  try {
    const contractAndTwitter = contractsAndTwitters.find(
      ({ contract }) => contract.address === contractAddress
    )
    if (!contractAndTwitter)
      throw new Error(`Could not find twitter for contract ${contractAddress}`)
    const { contract } = contractAndTwitter
    const { post: text, derivativeAddress } = await contract.posts(blockchainId)
    const errors = (
      await Promise.all(messageFilters.map((filter) => filter(text)))
    ).filter((v) => !!v) as string[]
    if (!errors.length) {
      await TweetModel.create({
        blockchainId,
        contractAddress,
        status: Status.approved,
      })
    } else {
      await sendTweetOnDiscord({
        blockchainId,
        derivativeAddress,
        text,
        contractAddress,
        reasons: errors.join(', '),
      })
      await TweetModel.create({
        blockchainId,
        contractAddress,
        status: Status.pending,
      })
    }
  } catch (error) {
    logError('Adding post', error)
  }
}
