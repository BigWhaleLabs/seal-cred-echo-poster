import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import sendTweet from '@/helpers/sendTweet'

export default async function (tweetId: number, tweetContent: string) {
  // set status as approve and post on twitter
  await TweetModel.updateOne(
    {
      tweetId: tweetId,
    },
    { status: Status.approved }
  )
  console.log(`Tweet #${tweetId} was approved`)
  // disable button

  await sendTweet(tweetContent)
}
