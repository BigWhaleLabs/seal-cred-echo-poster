import { Controller, Get, Params, Query } from 'amala'
import { TweetModel } from '@/models/Tweet'
import Pagination from '@/validators/Pagination'
import TweetId from '@/validators/TweetId'

@Controller('/tweets')
export default class TweetController {
  @Get('/')
  getTweets(@Query() { skip, limit }: Pagination) {
    return TweetModel.find().skip(skip).limit(limit)
  }

  @Get('/:tweetId')
  getTweet(@Params() { tweetId }: TweetId) {
    return TweetModel.findOne({ tweetId: +tweetId })
  }
}
