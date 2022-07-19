import twitterRWClient from '@/helpers/twitterRWClient'

export default async function (tweetContent: string) {
  try {
    await twitterRWClient.v2.tweet(tweetContent)
  } catch (e) {
    console.log(e)
  }
}
