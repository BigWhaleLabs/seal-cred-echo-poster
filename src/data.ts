import ModerationLevel from '@/models/ModerationLevel'
import PostingService from '@/models/PostingService'
import env from '@/helpers/env'
import postToFarcaster from '@/helpers/postToFarcaster'
import postToTwitter from '@/helpers/postToTwitter'
import twitters from '@/helpers/twitters'

export default [
  {
    contract: env.SC_EMAIL_POSTS_CONTRACT_ADDRESS,
    moderationLevel: ModerationLevel.medium,
    post: (text: string) => postToTwitter(text, twitters.email),
    type: PostingService.twitter,
  },
  {
    contract: env.SC_ERC721_POSTS_CONTRACT_ADDRESS,
    moderationLevel: ModerationLevel.medium,
    post: (text: string) => postToTwitter(text, twitters.gnft),
    type: PostingService.twitter,
  },
  {
    contract: env.SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
    moderationLevel: ModerationLevel.medium,
    post: (text: string) => postToTwitter(text, twitters.nft),
    type: PostingService.twitter,
  },
  {
    contract: env.SC_FARCASTER_POSTS_CONTRACT_ADDRESS,
    moderationLevel: ModerationLevel.medium,
    post: (text: string, replyToId?: string) =>
      postToFarcaster(text, replyToId),
    type: PostingService.farcaster,
  },
]
