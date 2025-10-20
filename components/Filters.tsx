/**
 * Filter controls for the trace viewer
 */

interface FiltersProps {
  errorsOnly: boolean;
  searchQuery: string;
  errorCount: number;
  onErrorsOnlyChange: (value: boolean) => void;
  onSearchQueryChange: (value: string) => void;
}

export function Filters({
  errorsOnly,
  searchQuery,
  errorCount,
  onErrorsOnlyChange,
  onSearchQueryChange,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={errorsOnly}
            onChange={(e) => onErrorsOnlyChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Errors only
          </span>
        </label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {errorCount} errors
        </span>
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by tool, input, or error..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
