import createUrlRegExp = require('url-regex-safe')
import cld = require('cld')

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
  async (text: string) => {
    let lngDetect: cld.DetectLanguage
    try {
      lngDetect = await cld.detect(text)
    } catch (error) {
      return false
    }
    const languages = lngDetect.languages

    let isEnglish = !languages?.length || languages[0].code === 'en'
    if (!isEnglish && languages?.length) {
      const baseConfidence = +languages[0].percent
      for (const language of languages.slice(1)) {
        if (+language.percent < baseConfidence) {
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
          .map((l: cld.Language) => `${l.name} ${l.percent}%`)
          .join(', ')})`
  },
] as ((text: string) => false | string)[]
