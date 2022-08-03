import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import ContractType from '@/models/ContractType'
import actionRowButtons from '@/helpers/actionRowButtons'
import handleError from '@/helpers/handleError'
import isTwitterError from '@/helpers/isTwitterError'
import sendToChannel from '@/helpers/sendToChannel'

export default async function ({
  id,
  type,
  postContent,
  channel,
  error,
  extraTitle,
}: {
  id: number
  type: ContractType
  postContent: string
  channel: TextChannel
  error: unknown
  extraTitle?: string
}) {
  const message = error instanceof Error ? error.message : error
  const details = isTwitterError(error) ? error.data.detail : 'no details'
  const content = postContent ? `: \n\n${postContent}` : ''
  const description = `${message} [${details}] for the post (id: ${id}, type: ${type})${content}`

  const row = actionRowButtons({ id, type, approveText: 'Re-Approve' })

  const embed = new EmbedBuilder()
    .setColor(Colors.DarkRed)
    .setTitle('Error ' + extraTitle)
    .setDescription(description)
  try {
    await sendToChannel(channel, embed, row)
  } catch (discordError) {
    handleError('Error sending error message to Discord', discordError)
  }
}
