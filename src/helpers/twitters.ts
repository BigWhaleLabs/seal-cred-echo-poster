import { TwitterApi } from 'twitter-api-v2'
import env from '@/helpers/env'

export default {
  email: new TwitterApi({
    accessSecret: env.EMAIL_TWITTER_ACCESS_SECRET,
    accessToken: env.EMAIL_TWITTER_ACCESS_TOKEN,
    appKey: env.EMAIL_TWITTER_APP_KEY,
    appSecret: env.EMAIL_TWITTER_APP_SECRET,
  }),
  gnft: new TwitterApi({
    accessSecret: env.NFT_TWITTER_ACCESS_SECRET,
    accessToken: env.NFT_TWITTER_ACCESS_TOKEN,
    appKey: env.NFT_TWITTER_APP_KEY,
    appSecret: env.NFT_TWITTER_APP_SECRET,
  }),
  nft: new TwitterApi({
    accessSecret: env.EXTERNAL_NFT_TWITTER_ACCESS_SECRET,
    accessToken: env.EXTERNAL_NFT_TWITTER_ACCESS_TOKEN,
    appKey: env.EXTERNAL_NFT_TWITTER_APP_KEY,
    appSecret: env.EXTERNAL_NFT_TWITTER_APP_SECRET,
  }),
}
