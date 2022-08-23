import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default function ({
  contractAddress,
  blockchainId,
  approveText = 'Approve',
  rejectText = 'Reject',
}: {
  contractAddress: string
  blockchainId: number
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${contractAddress}-${blockchainId}`)
      .setLabel(approveText)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${contractAddress}-${blockchainId}`)
      .setLabel(rejectText)
      .setStyle(ButtonStyle.Danger)
  )
}
