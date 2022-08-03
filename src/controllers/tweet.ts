import { Body, Controller, Get, IsEnum, Params, Post, Query } from 'amala'
import { IsInt, IsOptional } from 'amala'
import { PostModel } from '@/models/Post'
import ContractType from '@/models/ContractType'
import TweetId from '@/validators/TweetId'
import TweetIds from '@/validators/TweetIds'

class GetTweetBody {
  @IsInt()
  id!: TweetId
  @IsEnum(ContractType)
  type!: ContractType
}

class GetAllTweetsBody {
  @IsOptional()
  @IsInt()
  skip!: number
  @IsOptional()
  @IsInt()
  limit!: number
  @IsOptional()
  @IsEnum(ContractType)
  type!: ContractType
}

@Controller('/tweets')
export default class TweetController {
  @Get('/')
  getTweets(@Query() { skip, limit, type }: GetAllTweetsBody) {
    return PostModel.find({ type }).skip(skip).limit(limit)
  }

  @Get('/:id')
  getTweet(@Params() { id, type }: GetTweetBody) {
    return PostModel.findOne({ id, type })
  }

  @Post('/list')
  getTweetsByIds(@Body() { ids }: TweetIds) {
    return PostModel.find({ id: { $in: ids } })
  }
}
