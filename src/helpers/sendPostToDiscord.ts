import { Colors, TextChannel } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'
import ContractType from '@/models/ContractType'
import actionRowButtons from '@/helpers/actionRowButtons'
import getDerivativeSymbolOrName from '@/helpers/getDerivativeSymbolOrName'
import handleError from '@/helpers/handleError'
import sendErrorToDiscord from '@/helpers/sendErrorToDiscord'
import sendToChannel from '@/helpers/sendToChannel'

export default async function (
  channel: TextChannel,
  id: number,
  type: ContractType,
  derivativeAddress: string,
  postContent: string
) {
  const row = actionRowButtons({ id, type })
  const name = await getDerivativeSymbolOrName(derivativeAddress, type)
  const embed = new EmbedBuilder()
    .setColor(Colors.Default)
    .setTitle(
      `Post #${id} from ${name} ${type === ContractType.email ? '' : type}`
    )
    .setDescription(postContent)
  try {
    await sendToChannel(channel, embed, row)
  } catch (error) {
    handleError('Error sending post to Discord', error)
    await sendErrorToDiscord({
      error,
      channel,
      id,
      postContent,
      type,
      extraTitle: 'sending post to Discord',
    })
  }
}
