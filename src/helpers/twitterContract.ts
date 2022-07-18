import { SealCredTwitter__factory } from '@big-whale-labs/seal-cred-twitter-contract'
import { providers } from 'ethers'
import defaultProvider from '@/helpers/defaultProvider'
import env from '@/helpers/env'

function getSealCredTwitterContract(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return SealCredTwitter__factory.connect(
    env.SEALCRED_TWITTER_CONTRACT_ADDRESS,
    provider
  )
}

export default getSealCredTwitterContract(defaultProvider)
