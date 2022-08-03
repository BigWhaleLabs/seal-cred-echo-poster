import {
  SCERC721Derivative__factory,
  SCEmailDerivative__factory,
} from '@big-whale-labs/seal-cred-ledger-contract'
import PostType from '@/models/PostType'
import provider from '@/helpers/provider'

export default function (derivativeAddress: string, type: PostType) {
  if (type === PostType.email)
    return SCEmailDerivative__factory.connect(
      derivativeAddress,
      provider
    ).name()

  return SCERC721Derivative__factory.connect(
    derivativeAddress,
    provider
  ).symbol()
}
