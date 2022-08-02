import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import PostType from '@/models/PostType'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Post {
  @prop({ index: true, required: true })
  id!: number
  @prop({ required: true, enum: PostType })
  type!: PostType
  @prop({ required: true, enum: Status, default: Status.pending, index: true })
  status!: Status
  @prop()
  statusId?: string
}

export const PostModel = getModelForClass(Post)
