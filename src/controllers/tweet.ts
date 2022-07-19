import { Context } from 'vm'
import { Controller, Ctx, Get, IsString, Query } from 'amala'
import { TweetModel } from '@/models/Tweet'
import { notFound } from '@hapi/boom'

class TweetQuery {
  @IsString()
  tweetId!: string
}

@Controller('/tweet')
export default class TweetController {
  @Get('/:tweetId')
  async getTweet(@Ctx() ctx: Context, @Query() { tweetId }: TweetQuery) {
    const tweet = await TweetModel.findOne({ tweetId }).populate('tweet')
    if (!tweet) {
      return ctx.throw(notFound())
    }
    return tweet
  }
}
