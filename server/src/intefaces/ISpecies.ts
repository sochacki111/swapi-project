import IResourceDetails from './IResourceDetails';

export interface ISpecies {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | IResourceDetails;
  language: string;
  people: (string | IResourceDetails)[];
  films: (string | IResourceDetails)[];
}
