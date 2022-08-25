import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Tweet {
  @prop({ required: true })
  contractAddress!: string
  @prop({ index: true, required: true })
  blockchainId!: number
  @prop({ required: true, enum: Status, default: Status.pending, index: true })
  status!: Status
  @prop()
  tweetId?: string
}

export const TweetModel = getModelForClass(Tweet)
