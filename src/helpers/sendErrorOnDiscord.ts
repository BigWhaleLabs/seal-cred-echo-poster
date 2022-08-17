import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import handleError, { getMessageFromError } from '@/helpers/handleError'
import isTwitterError from '@/helpers/isTwitterError'

export default async function ({
  tweetId,
  derivativeAddress,
  channel,
  error,
  tweetContent,
  extraTitle,
  postStorageAddress,
}: {
  tweetId: number
  derivativeAddress: string
  channel: TextChannel
  error: unknown
  tweetContent?: string
  extraTitle?: string
  postStorageAddress: string
}) {
  const message = getMessageFromError(error)
  const details = isTwitterError(error) ? error.data.detail : 'no details'
  const content = tweetContent ? `: \n\n${tweetContent}` : ''
  const description = `${message} [${details}] for the tweet (id: ${tweetId})${content}`

  const row = actionButtonBuilder({
    tweetId,
    postStorageAddress,
    approveText: 'Re-Approve',
  })
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(`Error ${derivativeAddress} ${extraTitle}`)
    .setDescription(description)
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (discordError) {
    handleError('Error sending error message to Discord', error)
  }
}
