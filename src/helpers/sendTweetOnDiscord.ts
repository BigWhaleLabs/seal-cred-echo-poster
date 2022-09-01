import * as translate from '@vitalets/google-translate-api'
import { Colors } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import getChannel from '@/helpers/getChannel'
import getErrorChannel from '@/helpers/getErrorChannel'
import getSymbol from '@/helpers/getSymbol'
import logError from '@/helpers/logError'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'

export default async function ({
  blockchainId,
  derivativeAddress,
  text,
  contractAddress,
  reasons,
}: {
  blockchainId: number
  derivativeAddress: string
  text: string
  contractAddress: string
  reasons: string
}) {
  const channel = await getChannel()
  const row = actionButtonBuilder({ blockchainId, contractAddress })
  const symbol = await getSymbol(derivativeAddress)
  let english = true
  let translationText = ''
  reasons.split(', ').forEach((reason) => {
    if (reason.includes('not English')) {
      english = false
    }
  })
  if (!english) {
    const translation = await translate(text, { to: 'en' })
    translationText = '\nTranslation: ' + translation?.text
  }
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(`Blockchain post #${blockchainId} from ${symbol}`)
    .setDescription(
      `${text}\n\nModeration reasons: ${reasons}${translationText}`
    )
  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    })
  } catch (error) {
    logError('Sending tweet to Discord', error)
    const errorChannel = await getErrorChannel()
    await sendErrorOnDiscord({
      blockchainId,
      derivativeAddress,
      channel: errorChannel,
      error,
      extraTitle: 'sending tweet to Discord',
    })
  }
}
