function SavedSummaries({ summaries, onSelect, onDelete, onClose }) {
  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="card mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-semibold text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved Summaries
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {summaries.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <button
              onClick={() => onSelect(item)}
              className="flex-1 text-left"
            >
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
                {item.summary.bookTitle}
              </h3>
              <p className="text-sm text-secondary">
                by {item.summary.author}
                {item.savedAt && (
                  <span className="text-gray-400 ml-2">
                    · saved {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Summaries are saved in your browser's local storage
      </p>
    </div>
  );
}

export default SavedSummaries
