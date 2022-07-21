import * as dotenv from 'dotenv'
import {
  ETH_NETWORK,
  ETH_RPC,
  SC_EMAIL_LEDGER_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  MONGO: str(),
  PORT: num({ default: 1337 }),
  ETH_NETWORK: str({ default: ETH_NETWORK }),
  ETH_RPC: str({ default: ETH_RPC }),
  SC_TWITTER_CONTRACT_ADDRESS: str(),
  SC_EMAIL_LEDGER_CONTRACT_ADDRESS: str({
    default: SC_EMAIL_LEDGER_CONTRACT_ADDRESS,
  }),
  DISCORD_BOT_TOKEN: str(),
  DISCORD_CHANNEL_ID: str(),
  TWITTER_APP_KEY: str(),
  TWITTER_APP_SECRET: str(),
  TWITTER_ACCESS_TOKEN: str(),
  TWITTER_ACCESS_SECRET: str(),
})
