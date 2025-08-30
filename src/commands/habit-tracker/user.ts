import { ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags } from 'discord.js';
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
                try {
                    const existingUser = await User.findOne({discordId:userId}).lean()
                    if (existingUser) {
                        await interaction.reply({ content: 'You already have a profile!', flags:MessageFlags.Ephemeral });
                    } else {
                        const newUser = new User({
                            discordId:userId,
                            username:interaction.user.username
                        })
                        newUser.save();
                        await interaction.reply({ content:'Profile created successfully! 🎉', flags:MessageFlags.Ephemeral });
                    }
                } catch (error:any) {
                    console.error('Error creating user profile:', error);
                    await interaction.reply({ content: 'An unexpected error occurred while creating your profile.', flags: MessageFlags.Ephemeral });
                }

                break;
            case 'remove-me':
                const result = await User.findOneAndDelete({ 
                    discordId:userId,
                    username:interaction.user.username 
                });
                if (!result) {
                    await interaction.reply({ content: 'You don\'t have a profile to delete.', flags:MessageFlags.Ephemeral});
                } else {
                    await interaction.reply({ content: 'Your profile has been deleted. 🗑️', flags:MessageFlags.Ephemeral});
                }
                break;
            default :
                await interaction.reply({ content: 'Unknown subcommand!', flags:MessageFlags.Ephemeral})
                break;
        }
    }
}

export default habitUserCommand;