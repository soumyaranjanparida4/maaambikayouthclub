import React, { useState, useEffect } from 'react';
import { getGallery } from '../services/api';
import { Lightbox } from '../components/Lightbox';
import { Image as ImageIcon, Filter, Maximize2 } from 'lucide-react';

export const Gallery = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Committee',
    'Leaders',
    'Members',
    'Events',
    'Sports',
    'Cultural Programs',
    'Village Activities'
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGallery();
        setItems(res.data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      
      {/* Banner */}
      <section className="bg-brand-blue-950 text-white py-16 mb-12 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Photo Archive
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mt-4 tracking-tight">
            Barapada Moments & Memories
          </h1>
          <p className="text-slate-300 font-medium text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Click on any photo to preview in full-screen lightbox modal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-brand-blue-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-brand-blue-950">No Photos Found</h3>
            <p className="text-xs text-slate-500">There are no photos under category "{selectedCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative bg-slate-900">
                  <img
                    src={item.image_url}
                    alt={item.caption || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="self-end bg-amber-500 text-brand-blue-950 p-2 rounded-full shadow">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <p className="text-white text-xs font-bold mt-1 line-clamp-2">
                        {item.caption || 'Maa Ambika Youth Club Barapada'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-blue-950 truncate max-w-[180px]">
                    {item.caption || 'Barapada Event'}
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          items={filteredItems}
          onClose={() => setSelectedItem(null)}
          onSelect={(item) => setSelectedItem(item)}
        />
      )}
    </div>
  );
};
