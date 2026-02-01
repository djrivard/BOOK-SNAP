import { useState, useRef } from 'react'
import html2pdf from 'html2pdf.js'
import AmazonButton from './AmazonButton'
import AudibleButton from './AudibleButton'
import ShareButtons from './ShareButtons'
import SimilarBooks from './SimilarBooks'

function BookSummary({ summary, amazonUrl, onReset, onSave, isSaved, onSimilarBookClick }) {
  const [copied, setCopied] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const pdfContentRef = useRef(null)

  const handleCopy = () => {
    const textContent = formatSummaryAsText(summary)
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSave = () => {
    onSave()
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true)

    try {
      const element = pdfContentRef.current
      const opt = {
        margin: [20, 15, 20, 15], // top, left, bottom, right in mm
        filename: `${summary.bookTitle} - Summary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const formatSummaryAsText = (s) => {
    let text = `${s.bookTitle} by ${s.author}\n`
    if (s.publishYear) text += `Published: ${s.publishYear}\n`
    if (s.genre) text += `Genre: ${s.genre}\n`
    text += `\n${s.briefDescription}\n\n`
    text += `KEY TAKEAWAYS:\n`
    s.mainPoints.forEach((point, i) => {
      text += `\n${i + 1}. ${point.title}\n${point.description}\n`
    })
    text += `\nWHAT THE AUTHOR WANTS YOU TO DO:\n${s.callToAction}\n`
    text += `\nTHE BOTTOM LINE:\n${s.conclusion}\n`
    if (s.notableQuote) {
      text += `\nNOTABLE QUOTE:\n"${s.notableQuote}"\n`
    }
    if (s.targetAudience) {
      text += `\nIDEAL FOR: ${s.targetAudience}\n`
    }
    return text
  }

  const handleSimilarBookClick = (title, author) => {
    // Scroll to top and trigger a new search
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (onSimilarBookClick) {
      onSimilarBookClick(title, author)
    }
  }

  return (
    <div className="card animate-slide-up">
      {/* PDF Content Wrapper */}
      <div ref={pdfContentRef}>
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2 text-balance">
            {summary.bookTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-secondary mb-3">
            <span>by {summary.author}</span>
            {summary.publishYear && (
              <>
                <span className="text-gray-300">·</span>
                <span>{summary.publishYear}</span>
              </>
            )}
            {summary.pageCount && (
              <>
                <span className="text-gray-300">·</span>
                <span>{summary.pageCount} pages</span>
              </>
            )}
          </div>
          {summary.genre && (
            <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
              {summary.genre}
            </span>
          )}
          <p className="text-primary text-lg leading-relaxed">
            {summary.briefDescription}
          </p>
        </div>

        {/* Primary Buy Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 no-print">
          <AmazonButton amazonUrl={amazonUrl} variant="primary" />
          <AudibleButton bookTitle={summary.bookTitle} author={summary.author} />
        </div>

        <div className="section-divider"></div>

        {/* Key Takeaways Section */}
        <section className="mb-8">
          <h3 className="text-xl font-serif font-semibold text-primary mb-5 flex items-center gap-2">
            <span className="text-2xl">📝</span> Key Takeaways
          </h3>
          <div className="space-y-5">
            {summary.mainPoints.map((point, index) => (
              <div key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-primary mb-1">{point.title}</h4>
                  <p className="text-secondary leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Call to Action Section */}
        <section className="mb-8">
          <h3 className="text-xl font-serif font-semibold text-primary mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span> What the Author Wants You to Do
          </h3>
          <div className="bg-accent/5 border-l-4 border-accent p-5 rounded-r-lg">
            <p className="text-primary leading-relaxed">{summary.callToAction}</p>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Conclusion Section */}
        <section className="mb-8">
          <h3 className="text-xl font-serif font-semibold text-primary mb-4">
            The Bottom Line
          </h3>
          <p className="text-secondary leading-relaxed text-lg">{summary.conclusion}</p>
        </section>

        {/* Notable Quote Section */}
        {summary.notableQuote && (
          <>
            <div className="section-divider"></div>
            <section className="mb-8">
              <blockquote className="relative pl-6 py-2">
                <span className="absolute left-0 top-0 text-5xl text-accent/30 font-serif leading-none">
                  "
                </span>
                <p className="text-primary italic text-lg leading-relaxed mb-2">
                  {summary.notableQuote}
                </p>
                <cite className="text-secondary text-sm not-italic">
                  — {summary.author}
                </cite>
              </blockquote>
            </section>
          </>
        )}

        {/* Target Audience Section */}
        {summary.targetAudience && (
          <>
            <div className="section-divider"></div>
            <section className="mb-8">
              <p className="text-secondary">
                <span className="font-medium text-primary">📖 This book is ideal for: </span>
                {summary.targetAudience}
              </p>
            </section>
          </>
        )}
      </div>

      {/* Similar Books Section */}
      {summary.similarBooks && summary.similarBooks.length > 0 && (
        <>
          <div className="section-divider"></div>
          <SimilarBooks
            books={summary.similarBooks}
            onBookClick={handleSimilarBookClick}
          />
        </>
      )}

      <div className="section-divider"></div>

      {/* Secondary Buy Buttons */}
      <div className="space-y-4 no-print">
        <div className="flex flex-wrap gap-3">
          <AmazonButton amazonUrl={amazonUrl} variant="secondary" />
          <AudibleButton bookTitle={summary.bookTitle} author={summary.author} />
        </div>

        <p className="text-xs text-gray-400">
          As an Amazon Associate, I earn from qualifying purchases.
        </p>

        {/* Share Section */}
        <div className="pt-4">
          <p className="text-sm font-medium text-primary mb-3">Share this summary:</p>
          <ShareButtons summary={summary} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-colors ${
              isSaved || justSaved
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'text-secondary hover:text-primary border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isSaved || justSaved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save Summary
              </>
            )}
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Summarize Another Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookSummary
