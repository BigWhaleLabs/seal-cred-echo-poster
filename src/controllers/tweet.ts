import { Controller, Get, Query } from 'amala'
import { TweetModel } from '@/models/Tweet'
import Pagination from '@/validators/Pagination'
import TweetId from '@/validators/TweetId'

@Controller('/tweets')
export default class TweetController {
  @Get('/')
  getTweets(@Query() { skip, limit }: Pagination) {
    return TweetModel.find().skip(skip).limit(limit)
  }

  @Get('/:id')
  getTweet(@Query() { id }: TweetId) {
    return TweetModel.findById(id)
  }
}
