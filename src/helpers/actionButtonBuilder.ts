import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default function ({
  derivativeAddress,
  tweetId,
  approveText = 'Approve',
  rejectText = 'Reject',
}: {
  derivativeAddress: string
  tweetId: number
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${derivativeAddress}-${tweetId}`)
      .setLabel(approveText)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${derivativeAddress}-${tweetId}`)
      .setLabel(rejectText)
      .setStyle(ButtonStyle.Danger)
  )
}
