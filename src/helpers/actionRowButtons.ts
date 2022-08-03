import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders'
import { ButtonStyle } from 'discord.js'
import ContractType from '@/models/ContractType'

export default function ({
  id,
  type,
  approveText,
  rejectText,
}: {
  id: number
  type: ContractType
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve-${id}-${type}`)
      .setLabel(approveText || 'Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject-${id}-${type}`)
      .setLabel(rejectText || 'Reject')
      .setStyle(ButtonStyle.Danger)
  )
}
