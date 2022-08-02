import {
  SCERC721Posts__factory,
  SCEmailPosts__factory,
} from '@big-whale-labs/seal-cred-posts-contract'
import { providers } from 'ethers'
import defaultProvider from '@/helpers/provider'
import env from '@/helpers/env'

function getSealCredErc721PostsContract(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return SCERC721Posts__factory.connect(env.SC_ERC721_POSTS_CONTRACT, provider)
}

export const scErc721PostsContract =
  getSealCredErc721PostsContract(defaultProvider)

function getSealCredEmailPostsContract(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return SCEmailPosts__factory.connect(env.SC_ERC721_POSTS_CONTRACT, provider)
}

export const scEmailPostsContract =
  getSealCredEmailPostsContract(defaultProvider)
