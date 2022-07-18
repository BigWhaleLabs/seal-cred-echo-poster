import {
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

export default async (interaction: Interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'newTweet') {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('approve')
        .setLabel('Approve')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('reject')
        .setLabel('Reject')
        .setStyle('SECONDARY')
    )

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org')
      .setDescription('Some description here')

    await interaction.reply({
      content: 'Pong!',
      ephemeral: true,
      embeds: [embed],
      components: [row],
    })
  }
}
