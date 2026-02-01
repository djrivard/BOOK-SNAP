function SimilarBooks({ books, onBookClick }) {
  if (!books || books.length === 0) return null;

  const affiliateTag = 'thinkingroc0e-20';

  return (
    <section className="mb-8">
      <h3 className="text-xl font-serif font-semibold text-primary mb-5 flex items-center gap-2">
        <span className="text-2xl">📚</span> You Might Also Enjoy
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((book, index) => {
          const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}&tag=${affiliateTag}`;

          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-primary group-hover:text-accent transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-sm text-secondary mb-2">by {book.author}</p>
                  <p className="text-sm text-gray-500">{book.reason}</p>
                </div>
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-amazon hover:text-orange-600 transition-colors"
                  title="View on Amazon"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </a>
              </div>
              <button
                onClick={() => onBookClick(book.title, book.author)}
                className="mt-3 text-xs text-accent hover:text-amber-600 font-medium transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Get summary of this book
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SimilarBooks
