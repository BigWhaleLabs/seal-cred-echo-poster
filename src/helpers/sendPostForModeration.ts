import * as translate from '@vitalets/google-translate-api'
import { Colors } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import ModerationLevel from '@/models/ModerationLevel'
import PostingService from '@/models/PostingService'
import actionButtonBuilder from '@/helpers/actionButtonBuilder'
import channels from '@/helpers/channels'
import getSymbol from '@/helpers/getSymbol'
import logError from '@/helpers/logError'
import sendErrorOnDiscord from '@/helpers/sendErrorOnDiscord'
import typeToChannel from '@/helpers/typeToChannel'

export default async function ({
  blockchainId,
  contractAddress,
  derivativeAddress,
  moderationLevel,
  postingService,
  reasons,
  text,
}: {
  blockchainId: number
  derivativeAddress: string
  text: string
  contractAddress: string
  reasons: string
  postingService: PostingService
  moderationLevel: ModerationLevel
}) {
  const channel = await typeToChannel[postingService]()
  const row = actionButtonBuilder({
    blockchainId,
    contractAddress,
    postingService,
  })
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
      `${text}${
        moderationLevel === ModerationLevel.medium
          ? `\n\nModeration reasons: ${reasons}${translationText}`
          : ''
      }`
    )
  try {
    await channel.send({
      components: [row],
      embeds: [embed],
    })
  } catch (error) {
    logError('Sending post to Discord', error)
    const errorChannel = await channels.error()
    await sendErrorOnDiscord({
      blockchainId,
      channel: errorChannel,
      derivativeAddress,
      error,
      extraTitle: `sending post to Discord for ${postingService}`,
    })
  }
}
