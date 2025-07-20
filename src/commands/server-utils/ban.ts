import  { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js'
import { Command } from '../../interfaces.js';


const banCommand:Command = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    execute: async (interaction:ChatInputCommandInteraction)=>{
        const target = interaction.options.getUser('target')!;
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        // Check if the bot can ban the target
        const targetMember = await interaction.guild?.members.fetch(target.id).catch(() => null);
        
        if (!targetMember) {
            await interaction.editReply({ content: 'That user is not in this server!'});
        }
        
        if (!targetMember?.bannable) {
            await interaction.editReply({ content: 'I cannot ban this user! They may have higher permissions than me.'});
        }
        
        // Attempt to ban the user
        try {
            await interaction.guild?.members.ban(target, { reason });
            await interaction.reply(`Successfully banned **${target.tag}** from the server.\nReason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to ban this user!', ephemeral: true });
        }
    },
};

export default banCommand;