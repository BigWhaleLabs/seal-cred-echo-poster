import twitter from '@/helpers/twitter'

export default function (text: string) {
  return twitter.v2.tweet(text)
}
