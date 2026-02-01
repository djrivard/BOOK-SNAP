import { useState } from 'react'

function BookForm({ onSubmit, isLoading, error }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    if (!title.trim()) {
      setValidationError('Please enter a book title.')
      return
    }
    if (!author.trim()) {
      setValidationError('Please enter the author name.')
      return
    }

    onSubmit(title.trim(), author.trim())
  }

  const displayError = validationError || error

  return (
    <div className="card mb-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Book Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Atomic Habits"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-semibold text-primary mb-2"
          >
            Author Name
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g., James Clear"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {displayError && (
          <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-lg text-sm">
            {displayError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating Summary...
            </span>
          ) : (
            'Summarize This Book'
          )}
        </button>
      </form>
    </div>
  )
}

export default BookForm
