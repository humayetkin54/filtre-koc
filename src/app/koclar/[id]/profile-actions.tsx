"use client";

export function ShareButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title: document.title, url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <path strokeLinecap="round" d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
      </svg>
      Paylaş
    </button>
  );
}
