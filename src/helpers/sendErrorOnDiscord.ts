import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import getMessageFromError from '@/helpers/getMessageFromError'
import isTwitterError from '@/helpers/isTwitterError'
import logError from '@/helpers/logError'

export default async function ({
  blockchainId,
  channel,
  derivativeAddress,
  error,
  extraTitle,
  postContent,
}: {
  blockchainId: number
  derivativeAddress: string
  channel: TextChannel
  error: unknown
  postContent?: string
  extraTitle?: string
}) {
  const message = getMessageFromError(error)
  const details = isTwitterError(error) ? error.data.detail : 'no details'
  const content = postContent ? `: \n\n${postContent}` : ''
  const description = `${message} [${details}] for the post (blockchain id: ${blockchainId})${content}`

  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle(`Error ${derivativeAddress} ${extraTitle}`)
    .setDescription(description)
  try {
    await channel.send({
      embeds: [embed],
    })
  } catch (discordError) {
    logError('Sending error message to Discord', error)
  }
}
