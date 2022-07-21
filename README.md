# SealCredTwitter contract poster

## Installation and local launch

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/seal-cred-twitter-poster`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `MONGO`                       | URL of the mongo database                  |
| `PORT`                        | Port to run server on (defaults to 1337)   |
| `ETH_NETWORK`                 | ETH network (defaults to `@bwl/constants`) |
| `ETH_RPC`                     | ETH RPC (defaults to `@bwl/constants`)     |
| `SC_TWITTER_CONTRACT_ADDRESS` | SealCredTwitter contract address           |
| `DISCORD_BOT_TOKEN`           | Discord bot token                          |
| `DISCORD_CHANNEL_ID`          | Discord channel ID                         |
| `TWITTER_APP_KEY`             | Twitter app key                            |
| `TWITTER_APP_SECRET`          | Twitter app secret                         |
| `TWITTER_ACCESS_TOKEN`        | Twitter access token                       |
| `TWITTER_ACCESS_SECRET`       | Twitter access secret                      |

Also, please, consider looking at `.env.sample`.
