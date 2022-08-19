# SealCredTwitter contract poster

## Installation and local launch

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/seal-cred-twitter-poster`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                                        | Description                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `MONGO`                                     | URL of the mongo database                                                |
| `PORT`                                      | Port to run server on (defaults to 1337)                                 |
| `ETH_NETWORK`                               | Eth network for your providers and contract (defaults to @bwl/constants) |
| `ETH_RPC`                                   | Ethereum node RPC URI (defaults to @bwl/constants)                       |
| `SC_ERC721_POSTS_CONTRACT_ADDRESS`          | ERC721 (derivatives) posts storage contract                              |
| `SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS` | External ERC721 posts storage contract                                   |
| `SC_EMAIL_POSTS_CONTRACT_ADDRESS`           | External Email posts storage contract                                    |
| `DISCORD_BOT_TOKEN`                         | Discord bot token                                                        |
| `DISCORD_CHANNEL_ID`                        | Discord channel ID                                                       |
| `DISCORD_ERROR_CHANNEL_ID`                  | Discord error channel ID                                                 |
| `EMAIL_TWITTER_APP_KEY`                     | Email Twitter app key                                                    |
| `EMAIL_TWITTER_APP_SECRET`                  | Email Twitter app secret                                                 |
| `EMAIL_TWITTER_ACCESS_TOKEN`                | Email Twitter access token                                               |
| `EMAIL_TWITTER_ACCESS_SECRET`               | Email Twitter access secret                                              |
| `NFT_TWITTER_APP_KEY`                       | NFT Twitter app key                                                      |
| `NFT_TWITTER_APP_SECRET`                    | NFT Twitter app secret                                                   |
| `NFT_TWITTER_ACCESS_TOKEN`                  | NFT Twitter access token                                                 |
| `NFT_TWITTER_ACCESS_SECRET`                 | NFT Twitter access secret                                                |
| `EXTERNAL_NFT_TWITTER_APP_KEY`              | External NFT Twitter app key                                             |
| `EXTERNAL_NFT_TWITTER_APP_SECRET`           | External NFT Twitter app secret                                          |
| `EXTERNAL_NFT_TWITTER_ACCESS_TOKEN`         | External NFT Twitter access token                                        |
| `EXTERNAL_NFT_TWITTER_ACCESS_SECRET`        | External NFT Twitter access secret                                       |

Also, please, consider looking at `.env.sample`.
