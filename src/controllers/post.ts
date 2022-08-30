import { Body, Controller, Get, Params, Post, Query } from 'amala'
import { PostModel } from '@/models/Post'
import Pagination from '@/validators/Pagination'
import PostId from '@/validators/PostId'
import PostIds from '@/validators/PostIds'
import PostParams from '@/validators/PostParams'

@Controller('/posts/:contractAddress')
export default class PostController {
  @Get('/')
  getPosts(
    @Params() { contractAddress, postingService }: PostParams,
    @Query() { skip, limit }: Pagination
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
      contractAddress,
      blockchainId: +id,
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
      blockchainId: { $in: ids },
      postingService,
    })
  }
}
