import { ChatInputCommandInteraction, TextChannel, SlashCommandBuilder } from 'discord.js'; // Import EmbedBuilder
import { Command } from '../../interfaces/Commands.js';
import { fetchWeatherEmbed } from '../../utils/cmdFunctions/currentWeather.js';

const WeatherCommand:Command = {
    data:new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Gets the current weather for a specified city or the default city.')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('The city to get weather for (e.g., "Lipa", "Tokyo", "New York")')
                .setRequired(false)
        ),
    execute: async (interaction:ChatInputCommandInteraction) => {
        await interaction.deferReply(); // Acknowledge the command immediately as API calls can take time

        const cityOption:string | null = interaction.options.getString('city');
        const defaultCity:string = 'Lipa';

        const city:string = cityOption || defaultCity;
        const apiKey: string | undefined = process.env.WEATHER_API_KEY;
        const weatherChannelName:string  = process.env.WEATHER_CHANNEL_NAME || 'weather';

        if (!apiKey) {
            await interaction.editReply('The bot is not configured with a WeatherAPI key. Please contact an administrator.');
            return;
        }

         // Check if the command is being used in the designated #Weather channel
        const targetChannel = interaction.channel as TextChannel;
        if (targetChannel && targetChannel.name !== weatherChannelName.toLowerCase()) {
            await interaction.reply({
                content: `Please use the \`/weather\` command in the <#${targetChannel.guild.channels.cache.find(c => c.name === weatherChannelName)?.id || 'the designated weather channel'}> channel.`,
                ephemeral: false
            });
            return;
        }

        const result = await fetchWeatherEmbed(city, apiKey);

        if (typeof result === 'string') {
            await interaction.editReply(result); // It's an error message
        } else {
            await interaction.editReply({ embeds: [result] }); // It's the Embed
        }
    }
};

export default WeatherCommand;
