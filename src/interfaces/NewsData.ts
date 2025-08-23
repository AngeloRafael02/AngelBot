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
