import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import handleError from '@/helpers/handleError'
import isTwitterError from '@/helpers/isTwitterError'

export default async function ({
  tweetId,
  derivativeAddress,
  channel,
  error,
  tweetContent,
  extraTitle,
}: {
  tweetId: number
  derivativeAddress: string
  channel: TextChannel
  error: unknown
  tweetContent?: string
  extraTitle?: string
}) {
  const message = error instanceof Error ? error.message : error
  const details = isTwitterError(error) ? error.data.detail : 'no details'
  const content = tweetContent ? `: \n\n${tweetContent}` : ''
  const description = `${message} [${details}] for the tweet (id: ${tweetId})${content}`

  const row = actionButtonBuilder({
    tweetId,
    derivativeAddress,
    approveText: 'Re-Approve',
  })
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(extraTitle ? `Error: ${extraTitle}` : 'Error')
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
