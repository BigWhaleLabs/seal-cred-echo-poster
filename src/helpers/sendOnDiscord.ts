import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import approveHandler from '@/helpers/approveHandler'
import rejectHandler from '@/helpers/rejectHandler'

export default async function (
  channel: TextChannel,
  tweetId: number,
  derivativeAddress: string,
  tweet: string
) {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('approve')
      .setLabel('Approve')
      .setStyle('SUCCESS'),
    new MessageButton()
      .setCustomId('reject')
      .setLabel('Reject')
      .setStyle('DANGER')
  )
  const embed = new MessageEmbed()
    .setColor('DEFAULT')
    .setTitle(`${derivativeAddress} tweeted`)
    .setDescription(`${tweet}`)

  await channel.send({
    embeds: [embed],
    components: [row],
  })

  const collector = channel.createMessageComponentCollector({
    max: 1,
  })

  collector.on('end', async (collection) => {
    collection.forEach((click) => {
      console.log(`${click.user.id} ${click.customId}s this post.`)
    })

    if (collection.first()?.customId === 'approve') {
      await approveHandler(tweetId)
    }
    if (collection.first()?.customId === 'reject') {
      await rejectHandler(tweetId)
    }
  })
}
