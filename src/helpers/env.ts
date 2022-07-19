import * as dotenv from 'dotenv'
import {
  ETH_NETWORK,
  ETH_RPC,
  TWITTER_CALLBACK_URL,
} from '@big-whale-labs/constants'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  ETH_NETWORK: str({ default: ETH_NETWORK }),
  ETH_RPC: str({ default: ETH_RPC }),
  SEALCRED_TWITTER_CONTRACT_ADDRESS: str({}),
  MONGO: str(),
  DISCORD_BOT_TOKEN: str(),
  PORT: num({ default: 1337 }),
  TWITTER_APP_KEY: str(),
  TWITTER_APP_SECRET: str(),
  TWITTER_ACCESS_TOKEN: str(),
  TWITTER_ACCESS_SECRET: str(),
  TWITTER_CALLBACK_URL: str({ default: TWITTER_CALLBACK_URL }),
})
