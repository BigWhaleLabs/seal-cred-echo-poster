import { SCPostStorage__factory } from '@big-whale-labs/seal-cred-posts-contract'
import defaultProvider from '@/helpers/provider'
import env from '@/helpers/env'

export const scExternalErc721PostsContract = SCPostStorage__factory.connect(
  env.SC_EXTERNALERC721_POSTS_CONTRACT,
  defaultProvider
)

export const scErc721PostsContract = SCPostStorage__factory.connect(
  env.SC_ERC721_POSTS_CONTRACT,
  defaultProvider
)

export const scEmailPostsContract = SCPostStorage__factory.connect(
  env.SC_ERC721_POSTS_CONTRACT,
  defaultProvider
)
