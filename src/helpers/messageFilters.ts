import createUrlRegExp = require('url-regex-safe')
import LanguageDetect = require('languagedetect')

const urlRegex = createUrlRegExp()
const lngDetector = new LanguageDetect()

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
  (text: string) => !lngDetector.detect(text, 1) && 'not English',
  async (text: string) => {
    const languages = await lngDetector.detect(text)
    let isEnglish = !languages?.length || languages[0][0] === 'english'
    if (!isEnglish && languages?.length) {
      const baseConfidence = +languages[0][1]
      for (const language of languages.slice(1)) {
        if (+language[1] < baseConfidence) {
          break
        }
        if (language[0] === 'english') {
          isEnglish = true
          break
        }
      }
    }
    return isEnglish
      ? false
      : `not English (${languages
          .map((l) => `${l[0]} ${l[1]}`)
          .join(', ')
          .slice(0, 3)})`
  },
] as ((text: string) => false | string)[]
