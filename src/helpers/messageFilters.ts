import createUrlRegExp = require('url-regex-safe')
import langcheck = require('langcheck')

const urlRegex = createUrlRegExp()

const allowedAts = [
  'SealCredEmail',
  'SealCredGNFT',
  'SealCredNFT',
  'SealCred',
  'bigwhalelabs',
]
const atRegex = new RegExp(
  `(^|[^@\\w])@(?!(${allowedAts.join('|')})\\b)(\\w{1,15})\\b`,
  'gi'
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
    let isEnglish = !languages?.length || languages[0].code === 'en'
    if (!isEnglish && languages?.length) {
      const baseConfidence = +languages[0].confidence
      for (const language of languages.slice(1)) {
        if (+language.confidence < baseConfidence) {
          break
        }
        if (language.code === 'en') {
          isEnglish = true
          break
        }
      }
    }
    return isEnglish
      ? false
      : `not English (${languages
          .map((l) => `${l.code} ${l.confidence}`)
          .join(', ')})`
  },
] as ((text: string) => false | string)[]
