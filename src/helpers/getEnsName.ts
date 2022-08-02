import defaultProvider from '@/helpers/provider'

export default function (address: string) {
  return defaultProvider.lookupAddress(address)
}
