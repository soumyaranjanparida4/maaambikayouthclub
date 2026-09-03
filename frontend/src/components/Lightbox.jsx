import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export const Lightbox = ({ item, items = [], onClose, onSelect }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && items.length > 0) handleNext();
      if (e.key === 'ArrowLeft' && items.length > 0) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  
  const handlePrev = () => {
    if (items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIndex]);
  };

  const handleNext = () => {
    if (items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onSelect(items[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-brand-blue-950 transition-colors shadow-lg"
        aria-label="Close Preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Left */}
      {items.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-brand-blue-950 transition-colors shadow-lg"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
        <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl bg-slate-900">
          <img
            src={item.image_url}
            alt={item.caption || 'Gallery photo'}
            className="max-h-[70vh] max-w-full object-contain rounded-t-xl"
          />
          <div className="p-4 bg-brand-blue-950/90 backdrop-blur-md border-t border-white/10 text-center w-full">
            <span className="inline-block text-xs uppercase tracking-wider font-bold bg-amber-500 text-brand-blue-950 px-3 py-1 rounded-full mb-2">
              {item.category || 'Barapada Gallery'}
            </span>
            <p className="text-white text-base font-semibold">
              {item.caption || 'Maa Ambika Youth Club Barapada Event'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Right */}
      {items.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-brand-blue-950 transition-colors shadow-lg"
          aria-label="Next Image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};
