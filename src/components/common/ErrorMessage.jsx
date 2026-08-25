/**
 * ErrorMessage — inline error display
 */

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 rounded-md bg-red-800 px-3 py-1 text-xs font-medium text-red-100 hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
