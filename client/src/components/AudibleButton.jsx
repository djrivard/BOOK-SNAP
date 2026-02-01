function AudibleButton({ bookTitle, author }) {
  const audibleUrl = `https://www.audible.com/search?keywords=${encodeURIComponent(bookTitle + ' ' + author)}`;

  return (
    <a
      href={audibleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-audible"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v5h-2zm0 6h2v2h-2z"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="none"/>
        <path d="M10 16.5l-3.5-3.5 1.06-1.06L10 14.38l5.44-5.44 1.06 1.06L10 16.5z"/>
      </svg>
      <span>Listen on Audible</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  )
}

export default AudibleButton
