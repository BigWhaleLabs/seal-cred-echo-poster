import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import PostingService from '@/models/PostingService'

export default function ({
  contractAddress,
  blockchainId,
  postingService,
  approveText = 'Approve',
  rejectText = 'Reject',
}: {
  contractAddress: string
  blockchainId: number
  postingService: PostingService
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${contractAddress}-${blockchainId}-${postingService}`)
      .setLabel(approveText)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${contractAddress}-${blockchainId}-${postingService}`)
      .setLabel(rejectText)
      .setStyle(ButtonStyle.Danger)
  )
}
