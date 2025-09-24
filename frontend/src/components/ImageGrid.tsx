import { useState } from 'react';
import { Star } from 'lucide-react';
import type { DogImage, Favourite } from '../types';
import { useAddFavourite, useRemoveFavourite } from '../hooks/useApi';

interface ImageCardProps {
  image: DogImage;
  isFavourited: boolean;
}

function ImageCard({ image, isFavourited }: ImageCardProps) {
  const [loading, setLoading] = useState(true);
  const addFavourite = useAddFavourite();
  const removeFavourite = useRemoveFavourite();

  const handleFavouriteClick = () => {
    if (isFavourited) {
      removeFavourite.mutate(image.url);
    } else {
      addFavourite.mutate({ imageUrl: image.url, breed: image.breed });
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={image.url}
        alt={`${image.breed} dog`}
        loading="lazy"
        className={`w-full h-52 object-cover transition duration-500 ${
          loading ? 'blur-sm scale-[1.02]' : 'blur-0'
        }`}
        onLoad={() => setLoading(false)}
      />
      <div className="absolute inset-x-0 bottom-0 hidden group-hover:flex justify-between items-center p-2 bg-gradient-to-t from-black/60 to-transparent">
        <button
          onClick={handleFavouriteClick}
          disabled={addFavourite.isPending || removeFavourite.isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-gray-800 text-xs font-medium hover:bg-white disabled:opacity-50"
        >
          <Star
            className={`size-4 ${
              isFavourited ? 'fill-yellow-400 text-yellow-500' : 'text-gray-600'
            }`}
          />
          {isFavourited ? 'Favourited' : 'Favourite'}
        </button>
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/90 hover:text-white underline"
        >
          Open
        </a>
      </div>
    </div>
  );
}

interface ImageGridProps {
  images: DogImage[];
  favourites: Favourite[];
}

export function ImageGrid({ images, favourites }: ImageGridProps) {
  const favouriteUrls = new Set(favourites.map(f => f.image_url));

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No images to display</p>
        <p className="text-sm">Select a breed to view random images</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={`${image.url}-${index}`}
          image={image}
          isFavourited={favouriteUrls.has(image.url)}
        />
      ))}
    </div>
  );
}