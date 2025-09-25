import { useAppStore } from '../store';
import { classNames } from '../utils/classNames';

interface BreedListProps {
  breeds: string[];
}

function BreedPill({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  const [breed, sub] = name.split('/');
  return (
    <button
      onClick={onClick}
      className={classNames(
        "group w-full text-left px-3 py-2 rounded-xl border transition hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
        active ? "bg-indigo-50 border-indigo-300" : "bg-white border-gray-200"
      )}
      aria-pressed={active}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-medium capitalize">{breed}</span>
        {sub && (
          <span className="text-xs uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {sub}
          </span>
        )}
      </div>
    </button>
  );
}

export function BreedList({ breeds }: BreedListProps) {
  const { selectedBreed, setSelectedBreed, searchQuery } = useAppStore();

  if (breeds.length === 0) {
    return (
      <div className="text-base text-gray-500 p-3">
        {searchQuery ? `No breeds match "${searchQuery}".` : 'No breeds match your search.'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {breeds.map((breed) => (
        <BreedPill
          key={breed}
          name={breed}
          active={breed === selectedBreed}
          onClick={() => setSelectedBreed(breed)}
        />
      ))}
    </div>
  );
}