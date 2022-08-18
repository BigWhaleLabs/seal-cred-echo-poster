import { TweetModel } from '@/models/Tweet'
import Status from '@/models/Status'
import contractsAndTwitters from '@/helpers/contractsAndTwitters'
import createUrlRegExp = require('url-regex-safe')
import langcheck = require('langcheck')
import logError from '@/helpers/logError'
import sendTweetOnDiscord from '@/helpers/sendTweetOnDiscord'

const urlRegex = createUrlRegExp()

export default async function (tweetId: number, contractAddress: string) {
  try {
    const contractAndTwitter = contractsAndTwitters.find(
      ({ contract }) => contract.address === contractAddress
    )
    if (!contractAndTwitter)
      throw new Error(`Could not find twitter for contract ${contractAddress}`)
    const { contract } = contractAndTwitter
    const { post: text, derivativeAddress } = await contract.posts(tweetId)
    const containsAt = text.includes('@')
    const containsLinks = urlRegex.test(text)
    const containsHashtags = text.includes('#')
    const languages = (await langcheck(text)) as {
      code: string
      confidence: string
    }[]
    const isEnglish = !languages || !languages[0] || languages[0].code === 'en'
    if (isEnglish && !containsAt && !containsLinks && !containsHashtags) {
      await TweetModel.create({
        tweetId,
        contractAddress,
        status: Status.approved,
      })
    } else {
      await sendTweetOnDiscord({
        tweetId,
        derivativeAddress,
        text,
        contractAddress,
        reasons: [
          containsAt && 'contains @',
          containsLinks && 'contains links',
          containsHashtags && 'contains #',
          !isEnglish && 'not English',
        ]
          .filter((v) => !!v)
          .join(', '),
      })
      await TweetModel.create({
        tweetId,
        contractAddress,
        status: Status.pending,
      })
    }
  } catch (error) {
    logError('Adding post', error)
  }
}
