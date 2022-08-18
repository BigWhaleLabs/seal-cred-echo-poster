import createUrlRegExp = require('url-regex-safe')
import langcheck = require('langcheck')

const urlRegex = createUrlRegExp()

const allowedAts = ['SealCredEmail', 'SealCredGNFT', 'SealCredNFT']
const atRegex = new RegExp(
  `(^|[^@\\w])@(?!(${allowedAts.join('|')})\\b)(\\w{1,15})\\b`
)

// Returns `false` if text passes, an error string if it doesn't
export default [
  (text: string) => atRegex.test(text) && 'contains @',
  (text: string) => urlRegex.test(text) && 'contains links',
  (text: string) => !langcheck(text) && 'not English',
  async (text: string) => {
    const languages = (await langcheck(text)) as {
      code: string
      confidence: string
    }[]
    const isEnglish = !languages || !languages[0] || languages[0].code === 'en'
    return isEnglish
      ? false
      : `not English (${languages
          .map((l) => `${l.code} ${l.confidence}`)
          .join(', ')})`
  },
] as ((text: string) => false | string)[]
