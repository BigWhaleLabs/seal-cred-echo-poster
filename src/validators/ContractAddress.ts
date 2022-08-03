import { IsEthereumAddress } from 'amala'

export default class {
  @IsEthereumAddress()
  contractAddress!: number
}
