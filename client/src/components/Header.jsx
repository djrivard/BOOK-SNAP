function Header({ onShowHistory, historyCount }) {
  return (
    <header className="glass-header text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-4xl md:text-5xl" role="img" aria-label="Open book">
          📖
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
          BookSnap
        </h1>
      </div>
      <p className="text-secondary text-lg md:text-xl font-medium">
        Book Summaries in Seconds
      </p>
      {historyCount > 0 && (
        <button
          onClick={onShowHistory}
          className="mt-4 text-sm text-accent hover:text-amber-600 font-medium transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Saved Summaries ({historyCount})
        </button>
      )}
    </header>
  )
}

export default Header
