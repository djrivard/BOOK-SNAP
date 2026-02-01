import { useState } from 'react';

function ShareButtons({ summary }) {
  const [copiedForFacebook, setCopiedForFacebook] = useState(false);

  const shareText = `I just read a summary of "${summary.bookTitle}" by ${summary.author} on BookSnap! Key takeaway: ${summary.mainPoints[0]?.title || 'Great insights'}`;
  const shareUrl = window.location.href;

  const handleFacebookShare = async () => {
    // Copy text to clipboard first since Facebook doesn't allow pre-filled text
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedForFacebook(true);
      setTimeout(() => setCopiedForFacebook(false), 3000);
    } catch (err) {
      console.error('Could not copy text:', err);
    }

    // Open Facebook share dialog
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = `Book Summary: ${summary.bookTitle} by ${summary.author}`;
    const body = `I thought you might enjoy this book summary!\n\n${summary.bookTitle} by ${summary.author}\n\n${summary.briefDescription}\n\nKey Takeaways:\n${summary.mainPoints.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n\n')}\n\nCheck it out at: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <button
            onClick={handleFacebookShare}
            className="btn-share bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          {copiedForFacebook && (
            <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              Text copied! Paste in your post
            </div>
          )}
        </div>

        <button
          onClick={handleTwitterShare}
          className="btn-share bg-black hover:bg-gray-800 text-white text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X
        </button>

        <button
          onClick={handleEmailShare}
          className="btn-share bg-gray-600 hover:bg-gray-700 text-white text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
      </div>

      {copiedForFacebook && (
        <p className="text-xs text-green-600">
          Caption copied to clipboard! Paste it in your Facebook post.
        </p>
      )}
    </div>
  );
}

export default ShareButtons
