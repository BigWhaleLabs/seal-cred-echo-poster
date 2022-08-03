import { SCPostStorage__factory } from '@big-whale-labs/seal-cred-posts-contract'
import defaultProvider from '@/helpers/provider'

export default function (address: string) {
  return SCPostStorage__factory.connect(address, defaultProvider)
}
