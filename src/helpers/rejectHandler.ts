import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'

export default async function (tweetId: number) {
  await TweetModel.updateOne(
    {
      tweetId: tweetId,
    },
    { status: Status.rejected }
  )
}
