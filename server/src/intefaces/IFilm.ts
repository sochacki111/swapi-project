export interface IFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  // starships: (string | { id: string; name: string; hasAccess: boolean })[];
  starships: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
  vehicles: string[];
  species: string[];
}
