import IResourceDetails from './IResourceDetails';

export interface IFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: (string | IResourceDetails)[];
  planets: (string | IResourceDetails)[];
  starships: (string | IResourceDetails)[];
  vehicles: (string | IResourceDetails)[];
  species: (string | IResourceDetails)[];
}
