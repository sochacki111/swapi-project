export interface IFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
  planets: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
  starships: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
  vehicles: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
  species: (string | { id: string; name: string; url?: string; hasAccess: boolean })[];
}
