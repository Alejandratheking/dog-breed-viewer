interface ErrorBannerProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-2xl border bg-amber-50 text-amber-900 p-4">
      <p className="text-sm font-medium">Error</p>
      <p className="text-sm">
        {error}
        {onRetry && (
          <button onClick={onRetry} className="underline ml-1">
            Retry
          </button>
        )}
      </p>
    </div>
  );
}