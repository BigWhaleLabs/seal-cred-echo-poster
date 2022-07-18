import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import Status from '@/types/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Tweet {
  @prop({ required: true })
  derivativeAddress!: string
  @prop({ index: true, required: true })
  tweet!: string
  @prop({ required: true })
  status!: Status
}

export const TweetModel = getModelForClass(Tweet)
