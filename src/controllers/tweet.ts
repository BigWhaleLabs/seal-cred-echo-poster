import { Body, Controller, Get, Params, Post, Query } from 'amala'
import { TweetModel } from '@/models/Tweet'
import Pagination from '@/validators/Pagination'
import TweetId from '@/validators/TweetId'
import TweetIds from '@/validators/TweetIds'

@Controller('/tweets')
export default class TweetController {
  @Get('/')
  getTweets(@Query() { skip, limit }: Pagination) {
    return TweetModel.find().skip(skip).limit(limit)
  }

  @Get('/:id')
  getTweet(@Params() { id }: TweetId) {
    return TweetModel.findOne({ tweetId: +id })
  }

  @Post('/list')
  getTweetsByIds(@Body() { ids }: TweetIds) {
    return TweetModel.find({ tweetId: { $in: ids } })
  }
}
