function LoadingState() {
  return (
    <div className="card animate-fade-in">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="skeleton h-10 w-3/4 rounded-lg"></div>
          <div className="skeleton h-5 w-1/2 rounded-lg"></div>
          <div className="skeleton h-6 w-20 rounded-full"></div>
        </div>

        {/* Brief description skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-5/6 rounded"></div>
        </div>

        {/* Button skeleton */}
        <div className="skeleton h-12 w-48 rounded-lg"></div>

        <div className="section-divider"></div>

        {/* Main points skeleton */}
        <div className="space-y-4">
          <div className="skeleton h-6 w-40 rounded-lg"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 pl-6">
              <div className="skeleton h-5 w-2/3 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-4/5 rounded"></div>
            </div>
          ))}
        </div>

        <div className="section-divider"></div>

        {/* Call to action skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-6 w-64 rounded-lg"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-3/4 rounded"></div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-2 mt-8 text-secondary">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span className="text-sm">Searching and analyzing book content...</span>
      </div>
    </div>
  )
}

export default LoadingState
