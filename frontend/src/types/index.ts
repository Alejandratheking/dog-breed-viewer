export interface Breed {
  name: string;
  subBreeds: string[];
}

export interface BreedMap {
  [breed: string]: string[];
}

export interface DogImage {
  url: string;
  breed: string;
}

export interface Favourite {
  id: number;
  image_url: string;
  breed: string;
  created_at: string;
}