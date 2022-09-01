import { Colors } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import getChannel from '@/helpers/getChannel'
import getErrorChannel from '@/helpers/getErrorChannel'
import logError from '@/helpers/logError'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function ({
  blockchainId,
  isApprove,
  discordUsername,
}: {
  blockchainId: number
  isApprove: boolean
  discordUsername: string
}) {
  const channel = await getChannel()
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(
      `${
        isApprove ? 'Approved' : 'Rejected'
      } post #${blockchainId} by ${discordUsername}`
    )
  try {
    await channel.send({
      embeds: [embed],
    })
  } catch (error) {
    logError('Sending post review to Discord', error)
    const errorChannel = await getErrorChannel()
    await sendErrorOnDiscord({
      blockchainId,
      channel: errorChannel,
      error,
      extraTitle: 'sending post review to Discord',
    })
  }
}
