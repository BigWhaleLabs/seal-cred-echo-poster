import createUrlRegExp = require('url-regex-safe')
import langcheck = require('langcheck')

const urlRegex = createUrlRegExp()

// Returns `false` if text passes, an error string if it doesn't
export default [
  (text: string) => text.includes('@') && 'contains @',
  (text: string) => urlRegex.test(text) && 'contains links',
  (text: string) => text.includes('#') && 'contains #',
  (text: string) => !langcheck(text) && 'not English',
  async (text: string) => {
    const languages = (await langcheck(text)) as {
      code: string
      confidence: string
    }[]
    const isEnglish = !languages || !languages[0] || languages[0].code === 'en'
    return isEnglish ? false : 'not English'
  },
] as ((text: string) => false | string)[]
