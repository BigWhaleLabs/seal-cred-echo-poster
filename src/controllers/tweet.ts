import { Body, Controller, Get, Params, Post, Query } from 'amala'
import { TweetModel } from '@/models/Tweet'
import ContractAddress from '@/validators/ContractAddress'
import Pagination from '@/validators/Pagination'
import TweetId from '@/validators/TweetId'
import TweetIds from '@/validators/TweetIds'

@Controller('/tweets/:contractAddress')
export default class TweetController {
  @Get('/')
  getTweets(
    @Params() { contractAddress }: ContractAddress,
    @Query() { skip, limit }: Pagination
  ) {
    return TweetModel.find({ contractAddress }).skip(skip).limit(limit)
  }

  @Get('/:id')
  getTweet(
    @Params() { contractAddress }: ContractAddress,
    @Params() { id }: TweetId
  ) {
    return TweetModel.findOne({ contractAddress, tweetId: +id })
  }

  @Post('/list')
  getTweetsByIds(
    @Params() { contractAddress }: ContractAddress,
    @Body() { ids }: TweetIds
  ) {
    return TweetModel.find({ contractAddress, tweetId: { $in: ids } })
  }
}
