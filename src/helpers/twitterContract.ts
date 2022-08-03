import { SCPostStorage__factory } from '@big-whale-labs/seal-cred-posts-contract'
import { providers } from 'ethers'
import defaultProvider from '@/helpers/provider'
import env from '@/helpers/env'

function getSealCredTwitterContract(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return SealCredTwitter__factory.connect(
    env.SC_TWITTER_CONTRACT_ADDRESS,
    provider
  )
}

export default getSealCredTwitterContract(defaultProvider)
