import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'; // Import EmbedBuilder
import { Command } from '../../interfaces/Commands.js';
import { User } from '../../models/User.js';
import { Habit } from '../../models/Habits.js'

const habitTrackerCommand:Command = {
    data: new SlashCommandBuilder()
        .setName('habits')
        .setDescription('Wrapper for Habit Tracker Feature')
        .addSubcommand(subcommand => 
            subcommand
                .setName('view')    
                .setDescription('View All Your habits')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription('Add another habits')
                .addStringOption(option =>
                    option.setName('habit')
                        .setDescription('Your Habit')
                )
                .addStringOption(option => 
                    option.setName('description')
                        .setDescription('further details of Habit')
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('mark')
                .setDescription('Mark a habit as finished for today')
                .addStringOption(option =>
                    option.setName('index')
                        .setDescription('Your Habit Index')
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('remove a habit')
                .addStringOption(option =>
                    option.setName('index')
                        .setDescription('Your Habit Index')
                )
        )
    ,
    execute: async (interaction:ChatInputCommandInteraction) => {
        await interaction.deferReply();
        const userId = interaction.user.id;
        const userName = interaction.user.username;
        const userCred = await User.findOne({
            discordId:userId,
            username:userName
        });
        if (!userCred) {

        } else {
            const option = interaction.options
            const subcommand = option.getSubcommand();
            switch (subcommand) {
                case 'view':
                    const res = await Habit.find({ ownerId:userId })  
                    if (!res) {

                    } else {

                    }
                    break;
                case 'add':
                    const habitExists = await Habit.find({ name:option.getString('habit') });
                    if (!habitExists){

                    } else {
                        const obj = new Habit({
                            name: option.getString('habit'),
                            description: option.getString('description') ?? '',
                            ownerId: userId,
                        });
                        await obj.save();
                    }
                    break;
                case 'mark':
                    const today = new Date();
                    const habitUpdate = await Habit.findOneAndUpdate(
                        { name:option.getString('habit') },
                        {
                            $set: { lastCompleted:today },
                            $push: { history:today }
                        },
                        { new: true }
                    )
                    if (habitUpdate) {
                        console.log(`Successfully updated habit: ${habitUpdate.name}`);
                    } else {
                        console.log(`No habit found with the name: ${option.getString('habit')}`);
                    }
                    break;
                case 'remove':
                    const deleteRes = await Habit.deleteOne({ name: option.getString('habit') });
                    if (!deleteRes) {

                    } else {

                    }
                    break;
                default:
                    break;
            }
        }
    }
}

export default habitTrackerCommand;