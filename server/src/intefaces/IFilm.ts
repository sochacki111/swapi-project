export interface IFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: (string | ResourceDetails)[];
  planets: (string | ResourceDetails)[];
  starships: (string | ResourceDetails)[];
  vehicles: (string | ResourceDetails)[];
  species: (string | ResourceDetails)[];
}

export interface ResourceDetails {
  id: string;
  name: string;
  hasAccess: boolean;
}
