import { Client, EmbedBuilder, TextChannel } from "discord.js";
import fetchTechnologyNewsEmbeds from "../commands/functions/techNews.js";
import fetchWeatherEmbed from "../commands/functions/currentWeather.js";

/**
 * Runs all daily scheduled tasks and sends their output to their respective channels.
 * @param discordClient The Discord client instance.
 * @param triggerSource For logging purposes (e.g., 'Scheduled Task', 'User Command').
 */
export async function runDailyTasks(discordClient: Client, triggerSource: string = 'Scheduled Task'): Promise<void> {
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    console.log(`[${currentTime}] Running daily tasks (triggered by: ${triggerSource})...`);

    // --- Helper function to send content to a channel ---
    async function sendContentToChannel(channelId: string, content: string | EmbedBuilder | EmbedBuilder[], taskName: string): Promise<void> {
        if (!channelId) {
            console.error(`[${currentTime}] Error: ${taskName} channel ID is not defined in CHANNEL_CONFIG.`);
            return;
        }

        try {
            const channel = await discordClient.channels.fetch(channelId);
            if (channel && channel.isTextBased()) {
                if (typeof content === 'string') {
                    await (channel as TextChannel).send(content);
                } else if (content instanceof EmbedBuilder) {
                    await (channel as TextChannel).send({ embeds: [content] });
                } else if ( Array.isArray(content) && content.every(item => item instanceof EmbedBuilder) ) {
                    await (channel as TextChannel).send({ embeds: content });
                }
                console.log(`[${currentTime}] ${taskName} report sent successfully to channel ID: ${channelId}`);
            } else {
                console.error(`[${currentTime}] Error: ${taskName} channel (ID: ${channelId}) not found or not a text channel.`);
            }
        } catch (error) {
            console.error(`[${currentTime}] Error sending ${taskName} report to channel ${channelId}:`, error);
        }
    }

    // --- Execute each task and send to its specific channel ---

    // Task 1: Weather Report
    try {
        const weatherResult = await fetchWeatherEmbed('Lipa', process.env.WEATHER_API_KEY!);
        await sendContentToChannel(process.env.WEATHER_CHANNEL_ID || 'weather', weatherResult, 'Weather');
    } catch (error) {
        console.error(`[${currentTime}] Critical error during Weather Task execution:`, error);
        // Optionally send a general error to a designated admin/logging channel
    }

    // Task 2: Daily Quote
    try {
        const newsResult = await fetchTechnologyNewsEmbeds(process.env.NEWS_API_KEY!);
        await sendContentToChannel(process.env.NEWS_CHANNEL_ID || 'news', newsResult, 'Tech News');
    } catch (error) {
        console.error(`[${currentTime}] Critical error during Daily News Task execution:`, error);
    }


    console.log(`[${currentTime}] All daily tasks finished attempting.`);
}