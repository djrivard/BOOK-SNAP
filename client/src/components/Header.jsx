function Header() {
  return (
    <header className="text-center mb-10 md:mb-12">
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
    </header>
  )
}

export default Header
