import { PermissionFlagsBits } from 'discord.js'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'un-ban', category: 'moderation',
    description: 'Unbans {user}.',
    memberPerms: PermissionFlagsBits.BanMembers,
    botPerms: PermissionFlagsBits.BanMembers,
    options: [
        new UserOption('user', 'The user to un-ban.', { required: true }),
        new StringOption('reason', 'The reason for this un-ban.')
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getUser('user', true)

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.id)
        return await interaction.reply({ embeds: [Embed.warning('You\'re not banned, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('I\'m not banned, silly.')], ephemeral: true })

    let bans = await guild.bans.fetch()
    let ban = bans.find(b => b.user.id == user.id)

    if (!ban)
        return await interaction.reply({ embeds: [Embed.warning('This user is not banned.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'
    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Unban, user.id, member.id, reason)
    
    await interaction.reply({ embeds: [Embed.default(`Case #${caseId}: un-ban`, `${user} has been un-banned.`, member.user)] })
    await guild.bans.remove(ban.user, reason)
})