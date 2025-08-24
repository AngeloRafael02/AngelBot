import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'; // Import EmbedBuilder
import { Command } from '../../interfaces/Commands.js';
import { User } from '../../models/User.js';

const habitUserCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Wrapper for Habit Tracker User Management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add-me')
                .setDescription('Add You on the Habit tracker Management')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-me')
                .setDescription('Remove You on the Habit tracker Management')
        ),
    execute: async (interaction:ChatInputCommandInteraction) => {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'add-me':
                const existingUser = await User.findOne({userId})
                if (existingUser) {
                    await interaction.reply({ content: 'You already have a profile!', ephemeral: true });
                } else {
                    const newUser = new User({
                        discordId:userId,
                        username:interaction.user.username
                    })
                    newUser.save();
                    await interaction.reply('Profile created successfully! 🎉');
                }
                break;
            case 'remove-me':
                const result = await User.findOneAndDelete({ 
                    discordId:userId,
                    username:interaction.user.username 
                });
                if (!result) {
                    await interaction.reply({ content: 'You don\'t have a profile to delete.'});
                } else {
                    await interaction.reply({ content: 'Your profile has been deleted. 🗑️'});
                }
                break;
            default :
                await interaction.reply({ content: 'Unknown subcommand!', ephemeral: true })
                break;
        }
    }
}

export default habitUserCommand;