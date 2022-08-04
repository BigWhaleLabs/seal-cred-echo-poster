import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  MONGO: str(),
  PORT: num({ default: 1337 }),
  DISCORD_BOT_TOKEN: str(),
  DISCORD_CHANNEL_ID: str(),
  EMAIL_TWITTER_APP_KEY: str(),
  EMAIL_TWITTER_APP_SECRET: str(),
  EMAIL_TWITTER_ACCESS_TOKEN: str(),
  EMAIL_TWITTER_ACCESS_SECRET: str(),
  NFT_TWITTER_APP_KEY: str(),
  NFT_TWITTER_APP_SECRET: str(),
  NFT_TWITTER_ACCESS_TOKEN: str(),
  NFT_TWITTER_ACCESS_SECRET: str(),
  EXTERNAL_NFT_TWITTER_APP_KEY: str(),
  EXTERNAL_NFT_TWITTER_APP_SECRET: str(),
  EXTERNAL_NFT_TWITTER_ACCESS_TOKEN: str(),
  EXTERNAL_NFT_TWITTER_ACCESS_SECRET: str(),
})
