import { TwitterApi } from 'twitter-api-v2'

export default async function (text: string, twitter: TwitterApi) {
  const {
    errors,
    data: { id },
  } = await twitter.readWrite.v2.tweet(text)
  if (errors && errors.length > 0) throw new Error(errors[0].reason)
  return id
}
