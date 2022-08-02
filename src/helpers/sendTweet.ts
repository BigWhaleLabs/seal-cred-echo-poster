import twitterApi from '@/helpers/twitterApi'

export default function (text: string) {
  return twitterApi.v2.tweet(text)
}
