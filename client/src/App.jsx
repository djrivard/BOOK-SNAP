import { useState, useRef } from 'react'
import Header from './components/Header'
import BookForm from './components/BookForm'
import LoadingState from './components/LoadingState'
import BookSummary from './components/BookSummary'
import Footer from './components/Footer'

function App() {
  const [summary, setSummary] = useState(null)
  const [amazonUrl, setAmazonUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const summaryRef = useRef(null)
  const formRef = useRef(null)

  const handleSubmit = async (title, author) => {
    setIsLoading(true)
    setError('')
    setSummary(null)

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Header />

        <main>
          <div ref={formRef}>
            <BookForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {isLoading && <LoadingState />}

          {summary && (
            <div ref={summaryRef}>
              <BookSummary
                summary={summary}
                amazonUrl={amazonUrl}
                onReset={handleReset}
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
