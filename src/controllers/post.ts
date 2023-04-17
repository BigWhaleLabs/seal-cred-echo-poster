import { Body, Controller, Get, Params, Post, Query } from 'amala'
import { PostModel } from '@/models/Post'
import Pagination from '@/validators/Pagination'
import PostId from '@/validators/PostId'
import PostIds from '@/validators/PostIds'
import PostParams from '@/validators/PostParams'

@Controller('/posts/:contractAddress/:postingService')
export default class PostController {
  @Get('/')
  getPosts(
    @Params() { contractAddress, postingService }: PostParams,
    @Query() { limit, skip }: Pagination
  ) {
    return PostModel.find({ contractAddress, postingService })
      .skip(skip)
      .limit(limit)
  }

  @Get('/:id')
  getPost(
    @Params() { contractAddress, postingService }: PostParams,
    @Params() { id }: PostId
  ) {
    return PostModel.findOne({
      blockchainId: +id,
      contractAddress,
      postingService,
    })
  }

  @Post('/list')
  getPostsByIds(
    @Params() { contractAddress, postingService }: PostParams,
    @Body() { ids }: PostIds
  ) {
    return PostModel.find({
      contractAddress,
      id: { $in: ids },
      postingService,
    })
  }
}
