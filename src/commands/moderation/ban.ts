import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { Command } from '../../Structures/Command'
import { MODERATOR } from '../../Util/Permissions'

export default new Command({
    name: 'ban', category: 'moderation',
    description: 'Bans `target` from the server.',
    permissions: MODERATOR,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target', description: 'The target user to ban.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'reason', description: 'The reason this user was banned.'
        }
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    let target = options.getMember('target')
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({ content: 'Unknown user.', ephemeral: true })
    else if (target.id == user.id)
        return await interaction.reply({ content: 'You cannot ban yourself, silly.', ephemeral: true })
    else if (target.id == client.user.id)
        return await interaction.reply({ content: 'You cannot ban me, silly.', ephemeral: true })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({ content: 'You cannot ban members with the same or higher permissions as you.', ephemeral: true })

    await target.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`You were banned from **${guild.name}**!`).setColor('DarkButNotBlack')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `Moderator: ${user.tag}` })
        ]
    })
    await target.ban({ deleteMessageDays: 7, reason })
    await target.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`**${target.user.tag}** was banned!`).setColor('Blue')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `Moderator: ${user.tag}` })
        ]
    })
})