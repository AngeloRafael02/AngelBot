import { EmbedBuilder, ColorResolvable } from 'discord.js'; // Import EmbedBuilder
import { WeatherData } from '../../interfaces.js';

/**
 * Fetches weather data from WeatherAPI.com and returns a Discord Embed.
 * @param city The city to get weather for.
 * @param apiKey Your WeatherAPI.com API key.
 * @returns A Discord EmbedBuilder or null if an error occurs.
 */
export const fetchWeatherEmbed =  async (city: string='Lipa', apiKey: string): Promise<EmbedBuilder | string> => {
    try {
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
        const response = await fetch(weatherUrl);
        const weatherData: WeatherData = await response.json();

        if (response.status !== 200) {
            // Handle API errors from WeatherAPI.com
            const errorMessage = weatherData.current ? weatherData.current.condition.text : `Error: ${response.status} - 'Unknown error`;
            return `Failed to get weather data for "${city}": ${errorMessage}`;
        }

        const location = weatherData.location.name;
        const tempC = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        const icon = weatherData.current.condition.icon;
        const humidity = weatherData.current.humidity;
        const windKPH = weatherData.current.wind_kph;
        const isDay = weatherData.current.is_day;
        const embedColor: ColorResolvable = isDay ? '#FFD700' : '#4682B4'; // Gold for day, SteelBlue for night
        const weatherEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`Current Weather in ${location}`)
            .setDescription(`**${condition}**`)
            .setThumbnail(`https:${icon}`) // WeatherAPI often gives relative URLs for icons
            .addFields(
                { name: 'Temperature', value: `${tempC}°C`, inline: true },
                { name: 'Humidity', value: `${humidity}%`, inline: true },
                { name: 'Wind', value: `${windKPH} kph`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by WeatherAPI.com' });
        return weatherEmbed;
    } catch (error) {
        console.error('Error in fetchWeatherEmbed:', error);
        return 'An error occurred while fetching the weather data. Please try again later.';
    }
}

export default fetchWeatherEmbed;
