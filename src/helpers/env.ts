import * as dotenv from 'dotenv'
import {
  ETH_NETWORK,
  ETH_RPC,
  SC_EMAIL_POSTS_CONTRACT_ADDRESS,
  SC_ERC721_POSTS_CONTRACT_ADDRESS,
  SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
  SC_FARCASTER_POSTS_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  DISCORD_BOT_TOKEN: str(),
  DISCORD_ERROR_CHANNEL_ID: str(),
  DISCORD_FARCASTER_CHANNEL_ID: str(),
  DISCORD_TWITTER_CHANNEL_ID: str(),
  EMAIL_TWITTER_ACCESS_SECRET: str(),
  EMAIL_TWITTER_ACCESS_TOKEN: str(),
  EMAIL_TWITTER_APP_KEY: str(),
  EMAIL_TWITTER_APP_SECRET: str(),
  ETH_NETWORK: str({ default: ETH_NETWORK }),
  ETH_RPC: str({ default: ETH_RPC }),
  EXTERNAL_NFT_TWITTER_ACCESS_SECRET: str(),
  EXTERNAL_NFT_TWITTER_ACCESS_TOKEN: str(),
  EXTERNAL_NFT_TWITTER_APP_KEY: str(),
  EXTERNAL_NFT_TWITTER_APP_SECRET: str(),
  FARCASTER_AUTH_TOKEN: str(),
  FARCASTER_PRIVATE_KEY: str(),
  MONGO: str(),
  NFT_TWITTER_ACCESS_SECRET: str(),
  NFT_TWITTER_ACCESS_TOKEN: str(),
  NFT_TWITTER_APP_KEY: str(),
  NFT_TWITTER_APP_SECRET: str(),
  PORT: num({ default: 1337 }),
  SC_EMAIL_POSTS_CONTRACT_ADDRESS: str({
    default: SC_EMAIL_POSTS_CONTRACT_ADDRESS,
  }),
  SC_ERC721_POSTS_CONTRACT_ADDRESS: str({
    default: SC_ERC721_POSTS_CONTRACT_ADDRESS,
  }),
  SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS: str({
    default: SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
  }),
  SC_FARCASTER_POSTS_CONTRACT_ADDRESS: str({
    default: SC_FARCASTER_POSTS_CONTRACT_ADDRESS,
  }),
})
