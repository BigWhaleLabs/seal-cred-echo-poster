import { PostModel } from '@/models/Post'
import { SCPostStorage } from '@big-whale-labs/seal-cred-posts-contract'
import ModerationLevel from '@/models/ModerationLevel'
import PostingService from '@/models/PostingService'
import Status from '@/models/Status'
import logError from '@/helpers/logError'
import messageFilters from '@/helpers/messageFilters'
import sendPostForModeration from '@/helpers/sendPostForModeration'

export default async function (
  blockchainId: number,
  postingService: PostingService,
  moderationLevel: ModerationLevel,
  contract: SCPostStorage
) {
  try {
    const contractAddress = contract.address
    const {
      derivativeAddress,
      id,
      post: text,
    } = await contract.posts(blockchainId)
    const errors = (
      await Promise.all(messageFilters.map((filter) => filter(text)))
    ).filter((v) => !!v) as string[]

    // Reject
    if (moderationLevel === ModerationLevel.high && errors.length) {
      await PostModel.create({
        blockchainId,
        contractAddress,
        id: id.toNumber(),
        postingService,
        status: Status.rejected,
      })
      return
    }
    // Moderate
    if (
      (moderationLevel === ModerationLevel.high && !errors.length) ||
      (moderationLevel === ModerationLevel.medium && errors.length)
    ) {
      await sendPostForModeration({
        blockchainId,
        contractAddress,
        derivativeAddress,
        moderationLevel,
        postingService,
        reasons: errors.join(', '),
        text,
      })
      await PostModel.create({
        blockchainId,
        contractAddress,
        id: id.toNumber(),
        postingService,
        status: Status.pending,
      })
      return
    }
    // Approve
    if (moderationLevel === ModerationLevel.medium && !errors.length) {
      await PostModel.create({
        blockchainId,
        contractAddress,
        id: id.toNumber(),
        postingService,
        status: Status.approved,
      })
      return
    }
  } catch (error) {
    logError('Adding post', error)
  }
}
