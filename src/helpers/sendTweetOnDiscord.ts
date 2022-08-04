import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import getSymbol from '@/helpers/getSymbol'
import handleError from '@/helpers/handleError'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function ({
  channel,
  tweetId,
  derivativeAddress,
  tweet,
}: {
  channel: TextChannel
  tweetId: number
  derivativeAddress: string
  tweet: string
}) {
  const row = actionButtonBuilder({ tweetId, derivativeAddress })
  const symbol = await getSymbol(derivativeAddress)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Tweet #${tweetId} from ${symbol}`)
    .setDescription(tweet)
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (error) {
    handleError('Error sending tweet to Discord', error)
    await sendErrorOnDiscord({
      tweetId,
      derivativeAddress,
      channel,
      error,
      extraTitle: 'sending tweet to Discord',
    })
  }
}
