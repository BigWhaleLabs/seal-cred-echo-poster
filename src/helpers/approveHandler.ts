import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'

export default async function (tweetId: number) {
  // set status as approve and post on twitter
  await TweetModel.updateOne(
    {
      tweetId: tweetId,
    },
    { status: Status.approved }
  )
}
