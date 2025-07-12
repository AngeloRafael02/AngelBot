import { Client, Collection } from "discord.js";

export interface ClientWithCommands extends Client {
  commands: Collection<string, any>
}

export interface Command {
    data: {
        name: string;
        description:string;
        // Add other properties of command.data here if they exist, e.g., description, options
    };
    execute: (...args: any[]) => Promise<void> | void; // Adjust based on your execute function's signature
}

export interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        wind_kph: number;
        pressure_mb: number;
    };
}

// Define the structure for a single 'data' item (e.g., an article or news item)
interface Article {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string; // Consider using Date type if parsing is done after receiving
  source: string;
  categories: string[];
  relevance_score: number | null; // Can be null based on the example
  locale: string;
}

interface Meta {
  found: number;
  returned: number;
  limit: number;
  page: number;
}

export interface NewsApiResponse {
  meta: Meta;
  data: Article[];
}