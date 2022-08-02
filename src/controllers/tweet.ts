import { Body, Controller, Get, Params, Post, Query } from 'amala'
import { PostModel } from '@/models/Post'
import Pagination from '@/validators/Pagination'
import TweetId from '@/validators/TweetId'
import TweetIds from '@/validators/TweetIds'

@Controller('/tweets')
export default class TweetController {
  @Get('/')
  getTweets(@Query() { skip, limit }: Pagination) {
    return PostModel.find().skip(skip).limit(limit)
  }

  @Get('/:id')
  getTweet(@Params() { id }: TweetId) {
    return PostModel.findOne({ id: +id })
  }

  @Post('/list')
  getTweetsByIds(@Body() { ids }: TweetIds) {
    return PostModel.find({ id: { $in: ids } })
  }
}
