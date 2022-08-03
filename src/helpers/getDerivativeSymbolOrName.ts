import {
  SCERC721Derivative__factory,
  SCEmailDerivative__factory,
} from '@big-whale-labs/seal-cred-ledger-contract'
import ContractType from '@/models/ContractType'
import provider from '@/helpers/provider'

export default async function (derivativeAddress: string, type: ContractType) {
  if (type === ContractType.email)
    return SCEmailDerivative__factory.connect(
      derivativeAddress,
      provider
    ).name()

  if (type === ContractType.erc721)
    return SCERC721Derivative__factory.connect(
      derivativeAddress,
      provider
    ).symbol()

  const ensName = await provider.lookupAddress(derivativeAddress)
  return ensName || derivativeAddress
}
