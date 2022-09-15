import { TwitterApi } from 'twitter-api-v2'
import env from '@/helpers/env'

export default {
  email: new TwitterApi({
    appKey: env.EMAIL_TWITTER_APP_KEY,
    appSecret: env.EMAIL_TWITTER_APP_SECRET,
    accessToken: env.EMAIL_TWITTER_ACCESS_TOKEN,
    accessSecret: env.EMAIL_TWITTER_ACCESS_SECRET,
  }),
  gnft: new TwitterApi({
    appKey: env.NFT_TWITTER_APP_KEY,
    appSecret: env.NFT_TWITTER_APP_SECRET,
    accessToken: env.NFT_TWITTER_ACCESS_TOKEN,
    accessSecret: env.NFT_TWITTER_ACCESS_SECRET,
  }),
  nft: new TwitterApi({
    appKey: env.EXTERNAL_NFT_TWITTER_APP_KEY,
    appSecret: env.EXTERNAL_NFT_TWITTER_APP_SECRET,
    accessToken: env.EXTERNAL_NFT_TWITTER_ACCESS_TOKEN,
    accessSecret: env.EXTERNAL_NFT_TWITTER_ACCESS_SECRET,
  }),
}
