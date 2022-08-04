import { TwitterApi } from 'twitter-api-v2'

export default function (text: string, twitter: TwitterApi) {
  return twitter.readWrite.v2.tweet(text)
}
