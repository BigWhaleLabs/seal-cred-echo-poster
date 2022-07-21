import twitterRWClient from '@/helpers/twitterRWClient'

export default function (tweetContent: string) {
  return twitterRWClient.v2.tweet(tweetContent)
}
