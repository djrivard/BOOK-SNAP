import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import BookForm from './components/BookForm'
import LoadingState from './components/LoadingState'
import BookSummary from './components/BookSummary'
import SavedSummaries from './components/SavedSummaries'
import Footer from './components/Footer'

const STORAGE_KEY = 'booksnap_saved_summaries'

function App() {
  const [summary, setSummary] = useState(null)
  const [amazonUrl, setAmazonUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedSummaries, setSavedSummaries] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const summaryRef = useRef(null)
  const formRef = useRef(null)

  // Load saved summaries from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSavedSummaries(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Error loading saved summaries:', err)
    }
  }, [])

  // Save to localStorage whenever savedSummaries changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSummaries))
    } catch (err) {
      console.error('Error saving summaries:', err)
    }
  }, [savedSummaries])

  const handleSubmit = async (title, author) => {
    setIsLoading(true)
    setError('')
    setSummary(null)
    setShowHistory(false)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSummary(data.summary)
      setAmazonUrl(data.amazonUrl)

      // Scroll to summary after a brief delay
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

    } catch (err) {
      console.error('API error:', err)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSummary(null)
    setAmazonUrl('')
    setError('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSaveSummary = () => {
    if (!summary) return

    // Check if already saved (by book title and author)
    const alreadySaved = savedSummaries.some(
      item => item.summary.bookTitle === summary.bookTitle &&
              item.summary.author === summary.author
    )

    if (!alreadySaved) {
      setSavedSummaries(prev => [
        { summary, amazonUrl, savedAt: new Date().toISOString() },
        ...prev
      ])
    }
  }

  const handleSelectSavedSummary = (item) => {
    setSummary(item.summary)
    setAmazonUrl(item.amazonUrl)
    setShowHistory(false)
    setError('')

    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDeleteSavedSummary = (index) => {
    setSavedSummaries(prev => prev.filter((_, i) => i !== index))
  }

  const isSummarySaved = summary && savedSummaries.some(
    item => item.summary.bookTitle === summary.bookTitle &&
            item.summary.author === summary.author
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Header
          onShowHistory={() => setShowHistory(!showHistory)}
          historyCount={savedSummaries.length}
        />

        <main>
          <div ref={formRef}>
            <BookForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {showHistory && (
            <SavedSummaries
              summaries={savedSummaries}
              onSelect={handleSelectSavedSummary}
              onDelete={handleDeleteSavedSummary}
              onClose={() => setShowHistory(false)}
            />
          )}

          {isLoading && <LoadingState />}

          {summary && (
            <div ref={summaryRef}>
              <BookSummary
                summary={summary}
                amazonUrl={amazonUrl}
                onReset={handleReset}
                onSave={handleSaveSummary}
                isSaved={isSummarySaved}
                onSimilarBookClick={handleSubmit}
              />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
