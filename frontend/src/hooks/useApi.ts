import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllBreeds, fetchBreedImages } from '../api/dogApi';
import { fetchFavourites, addFavourite, removeFavourite } from '../api/favouritesApi';
import type { BreedMap, DogImage, Favourite } from '../types';

export const useBreeds = () => {
  return useQuery<BreedMap>({
    queryKey: ['breeds'],
    queryFn: fetchAllBreeds,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
};

export const useBreedImages = (breed: string | null) => {
  return useQuery<DogImage[]>({
    queryKey: ['breed-images', breed],
    queryFn: () => (breed ? fetchBreedImages(breed, 3) : Promise.resolve([])),
    enabled: !!breed,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useFavourites = () => {
  return useQuery<Favourite[]>({
    queryKey: ['favourites'],
    queryFn: fetchFavourites,
    retry: 1,
  });
};

export const useAddFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageUrl, breed }: { imageUrl: string; breed: string }) =>
      addFavourite(imageUrl, breed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });
};

export const useRemoveFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) => removeFavourite(imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });
};