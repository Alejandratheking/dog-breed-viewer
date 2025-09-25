import { Star } from 'lucide-react';
import type { Favourite } from '../types';
import { useRemoveFavourite } from '../hooks/useApi';
import { useState, memo } from 'react';
import { useLazyLoading } from '../hooks/useLazyLoading';
import { classNames } from '../utils/classNames';

interface FavouriteCardProps {
  favourite: Favourite;
}

const FavouriteCard = memo(({ favourite }: FavouriteCardProps) => {
  const [loading, setLoading] = useState(true);
  const removeFavourite = useRemoveFavourite();
  const { targetRef, isIntersecting } = useLazyLoading();

  const handleRemoveFavourite = () => {
    removeFavourite.mutate(favourite.image_url);
  };

  return (
    <div ref={targetRef} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {isIntersecting ? (
        <img
          src={favourite.image_url}
          alt={`${favourite.breed} dog`}
          loading="lazy"
          className={classNames(
            "w-full h-52 object-cover transition duration-500",
            loading ? "blur-sm scale-[1.02]" : "blur-0"
          )}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <div className="w-full h-52 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 hidden group-hover:flex justify-between items-center p-2 bg-gradient-to-t from-black/60 to-transparent">
        <button
          onClick={handleRemoveFavourite}
          disabled={removeFavourite.isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-gray-800 text-xs font-medium hover:bg-white disabled:opacity-50"
        >
          <Star className="size-4 fill-yellow-400 text-yellow-500" />
          Remove
        </button>
        <a
          href={favourite.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/90 hover:text-white underline"
        >
          Open
        </a>
      </div>
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
        {favourite.breed.replace('/', ' • ')}
      </div>
    </div>
  );
});

interface FavouritesViewProps {
  favourites: Favourite[];
}

export function FavouritesView({ favourites }: FavouritesViewProps) {
  if (favourites.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0,1,2,3,4,5].map((i) => (
          <div key={i} className="relative rounded-2xl border border-dashed p-6 flex flex-col items-center justify-center text-gray-500 bg-white">
            <Star className="mb-2" />
            <p className="text-base">Your favourites will appear here</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favourites.map((favourite) => (
        <FavouriteCard key={favourite.id} favourite={favourite} />
      ))}
    </div>
  );
}