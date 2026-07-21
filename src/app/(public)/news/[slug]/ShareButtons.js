'use client';

import { useEffect, useState } from 'react';

export default function ShareButtons({ title }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || 'Découvrez cet article');

  return (
    <div className="mt-12 pt-8 border-t border-outline-variant flex items-center gap-4">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Partager :</span>
      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur WhatsApp"
      >
        <span className="material-symbols-outlined text-xl">chat</span>
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur Facebook"
      >
        <span className="material-symbols-outlined text-xl">share</span>
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur X (Twitter)"
      >
        <span style={{fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '18px'}}>𝕏</span>
      </a>
    </div>
  );
}
