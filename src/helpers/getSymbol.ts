import { ERC721__factory } from '@big-whale-labs/seal-cred-ledger-contract'
import provider from '@/helpers/provider'

export default function (contractAddress: string) {
  const derivativeContract = ERC721__factory.connect(contractAddress, provider)
  return derivativeContract.symbol()
}
