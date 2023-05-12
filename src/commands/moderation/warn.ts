import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'warn', description: 'Warns a user in DMs and deducts their reputation.',
	memberPerms: [PermissionsBitField.Flags.ModerateMembers],
	options: [
		Options.user('member', 'The member to warn.', true),
		Options.string('reason', 'The reason.', true, 1)
	],
	async execute(client, interaction) {
		const member = interaction.options.getMember('member')
		const reason = interaction.options.getString('reason', true)

		const errorEmbed = new EmbedBuilder()
			.setColor(Colors.Greyple)

		if (!member)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('Member not found.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === interaction.member.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t warn yourself, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t warn me, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.roles.highest.position >= interaction.member.roles.highest.position)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t warn members with the same or higher role than you.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (!member.moderatable)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I cannot moderate this member.')
						.toJSON()
				],
				ephemeral: true
			})

		try {
			await interaction.deferReply()

			const dmEmbed = new EmbedBuilder().setColor(client.color)
				.setTitle(`:warning: You have been warned in ${interaction.guild.name}!`)
				.setDescription(reason)
				.setTimestamp()
			const replyEmbed = new EmbedBuilder().setColor(client.color)
				.setDescription(`:warning: ${member} has been warned!`)

			await member.send({
				embeds: [dmEmbed.toJSON()]
			})
			await interaction.editReply({
				embeds: [replyEmbed.toJSON()]
			})
		} catch (error) {
			console.error(error)

			await interaction.deleteReply()
			await interaction.followUp({
				embeds: [
					errorEmbed.setDescription(`I couldn't DM this user.`)
						.toJSON()
				],
				ephemeral: true
			})
		}
	}
} as Command