export interface Script {
  id: string;
  title: string;
  writer: string;
  year: number;
  genre: string[];
  image: string;
  rating: number;
  ratingCount: number;
  description: string;
  category?: string;
}

export interface ScriptFilter {
  genre?: string;
  minRating?: number;
  year?: number;
  category?: string;
} 