import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import Status from '@/models/Status'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Tweet {
  @prop({ index: true, required: true })
  tweetId!: number
  @prop({ required: true })
  status?: Status
}

export const TweetModel = getModelForClass(Tweet)

export function createTweet(tweetId: number) {
  return TweetModel.create({ tweetId }, { status: Status.pending })
}
