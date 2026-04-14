import { useEffect } from 'react';
import DistortionCard from './DistortionCard.jsx';

export default function DistortionModal({ distortion, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors text-sm font-bold"
        >
          ✕
        </button>
        <DistortionCard distortion={distortion} mode="reference" />
      </div>
    </div>
  );
}
