import {
  SCERC721Posts__factory,
  SCEmailPosts__factory,
} from '@big-whale-labs/seal-cred-posts-contract'
import defaultProvider from '@/helpers/provider'
import env from '@/helpers/env'

export const scErc721PostsContract = SCERC721Posts__factory.connect(
  env.SC_ERC721_POSTS_CONTRACT,
  defaultProvider
)

export const scEmailPostsContract = SCEmailPosts__factory.connect(
  env.SC_ERC721_POSTS_CONTRACT,
  defaultProvider
)
