import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default function ({
  postStorageAddress,
  tweetId,
  approveText = 'Approve',
  rejectText = 'Reject',
}: {
  postStorageAddress: string
  tweetId: number
  approveText?: string
  rejectText?: string
}) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`a-${postStorageAddress}-${tweetId}`)
      .setLabel(approveText)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`r-${postStorageAddress}-${tweetId}`)
      .setLabel(rejectText)
      .setStyle(ButtonStyle.Danger)
  )
}
