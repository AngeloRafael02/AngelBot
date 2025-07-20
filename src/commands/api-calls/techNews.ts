import { SlashCommandBuilder, TextChannel, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../interfaces.js';
import { fetchTechnologyNewsEmbeds } from '../../utils/cmdFunctions/techNews.js';

const newsCommand:Command = {
    data:new SlashCommandBuilder()
        .setName('news')
        .setDescription('Fetches the latest top 3 technology news headlines.')
            .addStringOption(option =>
            option.setName('category')
                .setDescription('The category of News')
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply(); // Acknowledge the command immediately

        const categoryOption:string | null = interaction.options.getString('category') || 'tech';
        const newsChannelName:string = process.env.NEWS_CHANNEL_NAME || 'news'; // Default news channel
        const apiKey:string | undefined = process.env.NEWS_API_KEY;

        if (!apiKey) {
            await interaction.editReply('The bot is not configured with a NewsAPI key. Please contact an administrator.');
            return;
        }

        // Check if the command is being used in the designated #news channel
        const targetChannel = interaction.channel as TextChannel;
        if (targetChannel && targetChannel.name !== newsChannelName.toLowerCase()) {
            await interaction.reply({
                content: `Please use the \`/news\` command in the <#${targetChannel.guild.channels.cache.find(c => c.name === newsChannelName)?.id || 'the designated news channel'}> channel.`,
                ephemeral: false
            });
            return;
        }

        const categoriesArray:string[] =["general","politics","tech","business","entertainment"]
        const categoryInput = categoriesArray.includes(categoryOption) ? categoryOption : categoriesArray[0] ;
        const result = await fetchTechnologyNewsEmbeds(apiKey, 3, categoryInput);

        if (typeof result === 'string') {
            await interaction.editReply(result); // It's an error message
        } else {
            // Send each embed. If you want them all in one message, Discord allows up to 10 embeds per message.
            // Our fetchTechnologyNewsEmbeds returns an array of one embed with multiple fields.
            await interaction.editReply({ embeds: result });
        }
    }
}

export default newsCommand;