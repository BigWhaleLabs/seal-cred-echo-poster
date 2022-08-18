import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default function ({
  contractAddress,
  tweetId,
  approveText = 'Approve',
  rejectText = 'Reject',
}: {
  contractAddress: string
  tweetId: number
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${contractAddress}-${tweetId}`)
      .setLabel(approveText)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${contractAddress}-${tweetId}`)
      .setLabel(rejectText)
      .setStyle(ButtonStyle.Danger)
  )
}
