import { Colors } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import getChannel from '@/helpers/getChannel'
import getSymbol from '@/helpers/getSymbol'
import logError from '@/helpers/logError'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function ({
  tweetId,
  derivativeAddress,
  text,
  contractAddress,
  reasons,
}: {
  tweetId: number
  derivativeAddress: string
  text: string
  contractAddress: string
  reasons: string
}) {
  const channel = await getChannel()
  const row = actionButtonBuilder({ tweetId, contractAddress })
  const symbol = await getSymbol(derivativeAddress)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Tweet #${tweetId} from ${symbol}`)
    .setDescription(`${text}\n\nModeration reasons: ${reasons}`)
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (error) {
    logError('Sending tweet to Discord', error)
    await sendErrorOnDiscord({
      tweetId,
      derivativeAddress,
      channel,
      error,
      extraTitle: 'sending tweet to Discord',
    })
  }
}
