import { TwitterApi } from 'twitter-api-v2'
import env from '@/helpers/env'

const twitterClient = new TwitterApi({
  appKey: env.TWITTER_APP_KEY,
  appSecret: env.TWITTER_APP_SECRET,
  accessToken: env.TWITTER_ACCESS_TOKEN,
  accessSecret: env.TWITTER_ACCESS_SECRET,
})

const twitterRWClient = twitterClient.readWrite

export default twitterRWClient
