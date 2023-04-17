import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import PostingService from '@/models/PostingService'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Post {
  @prop({ required: true })
  contractAddress!: string
  @prop({ index: true, required: true })
  blockchainId!: number
  @prop({ index: true, required: true })
  id!: number
  @prop({ default: Status.pending, enum: Status, index: true, required: true })
  status!: Status
  @prop({ enum: PostingService, index: true, required: true })
  postingService!: PostingService
  @prop()
  serviceId?: string
}

export const PostModel = getModelForClass(Post)
