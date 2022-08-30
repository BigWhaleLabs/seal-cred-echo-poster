import ModerationLevel from '@/models/ModerationLevel'
import PostingService from '@/models/PostingService'
import env from '@/helpers/env'
import postToTwitter from '@/helpers/postToTwitter'
import twitters from '@/helpers/twitters'

export default [
  {
    type: PostingService.twitter,
    contract: env.SC_EMAIL_POSTS_CONTRACT_ADDRESS,
    post: (text: string) => postToTwitter(text, twitters.email),
    moderationLevel: ModerationLevel.medium,
  },
  {
    type: PostingService.twitter,
    contract: env.SC_ERC721_POSTS_CONTRACT_ADDRESS,
    post: (text: string) => postToTwitter(text, twitters.gnft),
    moderationLevel: ModerationLevel.medium,
  },
  {
    type: PostingService.twitter,
    contract: env.SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
    post: (text: string) => postToTwitter(text, twitters.nft),
    moderationLevel: ModerationLevel.medium,
  },
  {
    type: PostingService.farcaster,
    contract: env.SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
    post: (text: string) => {
      console.log(`Posting to Farcaster: ${text}`)
    },
    moderationLevel: ModerationLevel.high,
  },
]
