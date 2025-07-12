import { SlashCommandBuilder, PermissionFlagsBits,ChatInputCommandInteraction, InteractionResponse, Message } from 'discord.js';
import { Command } from '../interfaces.js';

const kickCommand:Command =  {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction:ChatInputCommandInteraction) => {
        const target = interaction.options.getUser('user')!;
        const reason = interaction.options.getString('reason') || 'No Reason Provided';
        const targetMember = await interaction.guild?.members.fetch(target.id).catch(() => null);

        if (!targetMember || targetMember==undefined) {
            await interaction.editReply({ content: 'That user is not in the server!'});
        }

        if (!targetMember?.kickable) {
           await interaction.editReply({ content: 'I cannot kick this user. They may have higher permission than me'});
        }

        try {
            await targetMember?.kick(reason);
            await interaction.editReply(`Successfully kicked **${target.tag}** from the server.\nReason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error trying to kick this user!'})
        }
    },
};

export default kickCommand;