import { useMemo } from 'react';
import { Dog, Search, Heart, ImageIcon } from 'lucide-react';
import { useAppStore } from './store';
import { useBreeds, useBreedImages, useFavourites } from './hooks/useApi';
import { BreedList } from './components/BreedList';
import { ImageGrid } from './components/ImageGrid';
import { FavouritesView } from './components/FavouritesView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBanner } from './components/ErrorBanner';

function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
          <Dog className="size-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-semibold">Dog Breed Viewer</h1>
          <p className="text-xs md:text-sm text-gray-500">Browse breeds, view images, and save favourites</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-gray-500">
        <ImageIcon className="size-4" />
        <span className="text-sm">Powered by Dog CEO API</span>
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
    const query = searchQuery.toLowerCase().trim();
    return Object.keys(breeds).filter(breed => breed.includes(query));
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
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
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
              {breedsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-sm text-gray-600">Loading breeds...</span>
                </div>
              ) : (
                <BreedList breeds={filteredBreeds} />
              )}
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

        <section className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {selectedBreed ? (
                <>
                  <h2 className="text-xl font-semibold capitalize">
                    {selectedBreed.replace('/', ' • ')}
                  </h2>
                  <p className="text-sm text-gray-500">Showing 3 random images</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Select a breed</h2>
                  <p className="text-sm text-gray-500">Choose a breed to view images</p>
                </>
              )}
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl border p-1 bg-white">
              <button
                onClick={() => setCurrentTab('browse')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  currentTab === 'browse'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-pressed={currentTab === 'browse'}
              >
                Browse
              </button>
              <button
                onClick={() => setCurrentTab('favourites')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  currentTab === 'favourites'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-pressed={currentTab === 'favourites'}
              >
                <Heart className="size-4" />
                Favourites
              </button>
            </div>
          </div>

          {imagesError && (
            <ErrorBanner error="Could not load images. Showing the last good set." />
          )}

          {currentTab === 'browse' ? (
            <div>
              {imagesLoading && selectedBreed && (
                <div className="flex items-center gap-2 mb-4">
                  <LoadingSpinner />
                  <span className="text-sm text-gray-700">Loading images...</span>
                </div>
              )}
              <ImageGrid images={images || []} favourites={favourites || []} />
            </div>
          ) : (
            <FavouritesView favourites={favourites || []} />
          )}
        </section>
      </main>

      <footer className="p-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dog Breed Viewer – UI Mock
      </footer>
    </div>
  );
}

export default App;
