import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Tweet {
  @prop({ index: true, required: true })
  tweetId!: number
  @prop({ required: true, enum: Status, default: Status.pending, index: true })
  status!: Status
  @prop()
  statusId?: string
}

export const TweetModel = getModelForClass(Tweet)
