import { IsEnum, IsEthereumAddress } from 'amala'
import PostingService from '@/models/PostingService'

export default class {
  @IsEthereumAddress()
  contractAddress!: number
  @IsEnum(PostingService)
  postingService!: PostingService
}
