import { useMemo } from 'react';
import { Dog, Search, Heart, ImageIcon } from 'lucide-react';
import { useAppStore } from './store';
import { useBreeds, useBreedImages, useFavourites } from './hooks/useApi';
import { BreedList } from './components/BreedList';
import { ImageGrid } from './components/ImageGrid';
import { FavouritesView } from './components/FavouritesView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBanner } from './components/ErrorBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BreedListSkeleton, ImageGridSkeleton } from './components/LoadingSkeletons';
import { classNames } from './utils/classNames';

function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
          <Dog className="size-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl font-semibold">Dog Breed Viewer</h1>
          <p className="text-sm md:text-base text-gray-500">Browse breeds, view images, and save favourites</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-gray-500">
        <ImageIcon className="size-4" />
        <span className="text-base">Powered by Dog CEO API</span>
      </div>
    </header>
  );
}

function App() {
  const { searchQuery, selectedBreed, currentTab, setSearchQuery, setCurrentTab } = useAppStore();
  const { data: breeds, isLoading: breedsLoading, error: breedsError } = useBreeds();
  const { data: images, isLoading: imagesLoading, error: imagesError } = useBreedImages(selectedBreed);
  const { data: favourites } = useFavourites();

  const filteredBreeds = useMemo(() => {
    if (!breeds) return [];

    // Flatten breeds to include sub-breeds as "breed/sub-breed"
    const allBreeds: string[] = [];
    Object.entries(breeds).forEach(([breed, subBreeds]) => {
      // Always add the main breed
      allBreeds.push(breed);

      // Also add each sub-breed as "breed/sub-breed"
      if (subBreeds.length > 0) {
        subBreeds.forEach(subBreed => {
          allBreeds.push(`${breed}/${subBreed}`);
        });
      }
    });

    // Filter based on search query
    const query = searchQuery.toLowerCase().trim();
    const filtered = allBreeds.filter(breed => breed.includes(query));

    return filtered;
  }, [breeds, searchQuery]);

  if (breedsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="p-6">
          <ErrorBanner error="Failed to load dog breeds. Please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <Header />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <label className="flex items-center gap-2 p-2 rounded-xl border bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <Search className="size-4 text-gray-500" />
              <input
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Search breeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search breeds"
              />
            </label>

            <div className="mt-4 h-[420px] overflow-auto pr-1">
              <ErrorBoundary>
                {breedsLoading ? (
                  <BreedListSkeleton />
                ) : (
                  <BreedList breeds={filteredBreeds} />
                )}
              </ErrorBoundary>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Tips</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Use arrow keys and Enter to navigate (a11y).</li>
              <li>Images update automatically when you pick a breed.</li>
              <li>Hover an image to favourite or open in a new tab.</li>
            </ul>
          </div>
        </aside>

        <section className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {selectedBreed ? (
                <>
                  <h2 className="text-2xl font-semibold capitalize">
                    {selectedBreed.replace('/', ' • ')}
                  </h2>
                  <p className="text-base text-gray-500">Showing 3 random images</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">Select a breed</h2>
                  <p className="text-base text-gray-500">Choose a breed to view images</p>
                </>
              )}
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl border p-1 bg-white">
              <button
                onClick={() => setCurrentTab('browse')}
                className={classNames(
                  "px-4 py-2 text-base rounded-lg",
                  currentTab === 'browse' ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                )}
                aria-pressed={currentTab === 'browse'}
              >
                Browse
              </button>
              <button
                onClick={() => setCurrentTab('favourites')}
                className={classNames(
                  "px-4 py-2 text-base rounded-lg",
                  currentTab === 'favourites' ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                )}
                aria-pressed={currentTab === 'favourites'}
              >
                <span className="inline-flex items-center gap-1"><Heart className="size-4"/>Favourites</span>
              </button>
            </div>
          </div>

          {currentTab === 'browse' ? (
            <ErrorBoundary>
              {imagesLoading && selectedBreed ? (
                <ImageGridSkeleton />
              ) : (
                <ImageGrid images={images || []} favourites={favourites || []} />
              )}
            </ErrorBoundary>
          ) : (
            <ErrorBoundary>
              <FavouritesView favourites={favourites || []} />
            </ErrorBoundary>
          )}

          {/* Error and loading states */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagesError && (
              <div className="rounded-2xl border bg-red-50 border-red-200 text-red-800 p-4">
                <p className="text-base font-medium">Unable to load images</p>
                <p className="text-base">Please check your connection and try again.</p>
              </div>
            )}
            {breedsLoading && (
              <div className="rounded-2xl border bg-white p-4 flex items-center gap-2">
                <LoadingSpinner />
                <span className="text-base text-gray-700">Loading breeds...</span>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Dog Breed Viewer – UI Mock</footer>
    </div>
  );
}

export default App;
