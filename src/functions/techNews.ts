import { EmbedBuilder } from 'discord.js';
import { NewsApiResponse } from '../interfaces.js';
import dotenv from 'dotenv';
dotenv.config();


/**
 * Fetches technology news from NewsAPI.org and returns an array of Discord Embeds.
 * @param apiKey Your NewsAPI.org API key.
 * @param count The number of articles to fetch (max 3 for a single embed).
 * @returns An array of EmbedBuilder objects or a string error message.
 */
export const fetchTechnologyNewsEmbeds = async (apiKey: string, count: number = 3): Promise<EmbedBuilder[] | string> => {
    try {
        const newsUrl = `https://api.thenewsapi.com/v1/news/top?categories=tech&api_token=${apiKey}&locale=us&limit=${count}`;//`https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=${count}&apiKey=${apiKey}`;
        const response:Response = await fetch(newsUrl);
        const res: NewsApiResponse = await response.json();
        const newsEmbeds: EmbedBuilder[] = [];

        // NewsAPI.org's free tier sometimes has rate limits, or might not return images/descriptions
        // We will create one embed, with multiple fields for each article.
        // Discord embeds have a limit of 25 fields. 10 articles means 10 fields.
        const mainEmbed = new EmbedBuilder()
            .setColor(0x0099ff) // Blue color
            .setTitle('📰 Top 3 Technology News Headlines 📰')  
            .setTimestamp()
            .setFooter({ text: 'Powered by NewsAPI.org' });

        res.data.forEach((article, index) => {
            let description = article.description || 'No description available.';
            // Truncate description if too long for embed field value
            if (description.length > 1024) { // Discord embed field value limited
                description = description.substring(0, 1021) + '...';
            }

            mainEmbed.addFields({
                name: `${index + 1}. ${article.title}`,
                value: `[${description}](${article.url})\n**Source:** ${article.source}`,
                inline: false // Each news article should be on its own line
            });
        });
        newsEmbeds.push(mainEmbed);
        return newsEmbeds;
    } catch (error) {
        console.error('Error in fetchTechnologyNewsEmbeds:', error);
        return 'An error occurred while fetching the technology news. Please try again later.';
    }
}

export default fetchTechnologyNewsEmbeds;