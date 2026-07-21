'use client';

import { useEffect, useState } from 'react';

export default function ShareButtons({ title }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || 'Découvrez cet article');

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erreur copie du lien:', err);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-outline-variant flex flex-wrap items-center gap-4">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Partager :</span>

      {/* WhatsApp */}
      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur WhatsApp"
      >
        <span className="material-symbols-outlined text-xl">chat</span>
      </a>

      {/* Facebook */}
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur Facebook"
      >
        <span className="material-symbols-outlined text-xl">share</span>
      </a>

      {/* X / Twitter */}
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 transition-transform shadow-sm"
        title="Partager sur X (Twitter)"
      >
        <span style={{fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '18px'}}>𝕏</span>
      </a>

      {/* Copier le lien */}
      <button
        onClick={handleCopyLink}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110 ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white'
        }`}
        title={copied ? 'Lien copié !' : 'Copier le lien'}
      >
        <span className="material-symbols-outlined text-xl">
          {copied ? 'check' : 'content_copy'}
        </span>
      </button>

      {/* Toast de confirmation */}
      {copied && (
        <span className="text-xs font-medium text-green-600 animate-pulse">
          Lien copié !
        </span>
      )}
    </div>
  );
}

