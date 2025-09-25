import type { BreedMap, DogImage } from '../types';

const DOG_API_BASE = 'https://dog.ceo/api';

export class DogApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'DogApiError';
    this.status = status;
  }
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchAllBreeds(): Promise<BreedMap> {
  try {
    const response = await fetchWithTimeout(`${DOG_API_BASE}/breeds/list/all`);

    if (!response.ok) {
      throw new DogApiError(`Failed to fetch breeds: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new DogApiError('API returned error status');
    }

    return data.message as BreedMap;
  } catch (error) {
    if (error instanceof DogApiError) throw error;
    throw new DogApiError('Network error fetching breeds');
  }
}

export async function fetchBreedImages(breed: string, count = 3): Promise<DogImage[]> {
  try {
    // For breeds with sub-breeds, the API expects: /breed/{main-breed}/{sub-breed}/images/random/{count}
    // For simple breeds: /breed/{breed}/images/random/{count}
    const breedParts = breed.split('/');
    const breedPath = breedParts.length === 2
      ? `${breedParts[0]}/${breedParts[1]}`
      : breed;

    const response = await fetchWithTimeout(
      `${DOG_API_BASE}/breed/${breedPath}/images/random/${count}`
    );

    if (!response.ok) {
      throw new DogApiError(`Failed to fetch images for ${breed}: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new DogApiError(`No images found for breed: ${breed}`);
    }

    const urls = Array.isArray(data.message) ? data.message : [data.message];
    return urls.map((url: string) => ({ url, breed }));
  } catch (error) {
    if (error instanceof DogApiError) throw error;
    throw new DogApiError(`Network error fetching images for ${breed}`);
  }
}