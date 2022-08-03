import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import ContractType from '@/models/ContractType'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Post {
  @prop({ index: true, required: true })
  id!: number
  @prop({ required: true, enum: ContractType })
  type!: ContractType
  @prop({ required: true, enum: Status, default: Status.pending, index: true })
  status!: Status
  @prop()
  statusId?: string
}

export const PostModel = getModelForClass(Post)
