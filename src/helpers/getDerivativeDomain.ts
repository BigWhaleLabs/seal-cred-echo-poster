import { SCEmailDerivative__factory } from '@big-whale-labs/seal-cred-ledger-contract'
import provider from '@/helpers/provider'

export default function (derivativeAddress: string) {
  const derivativeContract = SCEmailDerivative__factory.connect(
    derivativeAddress,
    provider
  )
  return derivativeContract.name()
}
