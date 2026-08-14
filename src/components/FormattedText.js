'use client';

import React, { useState } from 'react';

/**
 * Composant de Carrousel d'Images
 */
function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImg = images[currentIndex];

  return (
    <>
      <div className="my-6 border border-outline-variant/20 rounded-2xl overflow-hidden bg-surface-container-low shadow-md select-none">
        {/* Conteneur de l'image principale */}
        <div 
          className="relative w-full h-[320px] sm:h-[420px] bg-black/5 flex items-center justify-center cursor-zoom-in group"
          onClick={() => setLightboxImage(currentImg)}
        >
          <img
            src={currentImg.url}
            alt={currentImg.alt || `Diapositive ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.01]"
          />

          {/* Badge du nombre d'images */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 z-10">
            <span className="material-symbols-outlined text-sm">collections</span>
            <span>{currentIndex + 1} / {images.length}</span>
          </div>

          {/* Boutons de navigation (seulement si > 1 image) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-on-surface shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
                title="Image précédente"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-on-surface shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
                title="Image suivante"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}

          {/* Overlay d'agrandissement au survol */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-black/60 text-white p-2.5 rounded-full flex items-center gap-2 text-xs font-medium backdrop-blur-sm">
              <span className="material-symbols-outlined text-base">zoom_in</span>
              Cliquer pour agrandir
            </span>
          </div>
        </div>

        {/* Barre inférieure : Légende & Puces */}
        <div className="p-3 bg-surface-container-high/60 border-t border-outline-variant/15 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Légende */}
          <p className="text-xs text-on-surface-variant italic truncate max-w-full text-center sm:text-left">
            {currentImg.alt ? currentImg.alt : `Image ${currentIndex + 1} sur ${images.length}`}
          </p>

          {/* Puces indicatrices */}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-on-surface-variant/30 hover:bg-on-surface-variant/60'
                  }`}
                  title={`Aller à l'image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 transition-colors z-10"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.alt || 'Agrandissement'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {lightboxImage.alt && (
              <p className="text-white/90 text-sm mt-3 text-center italic bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                {lightboxImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Component to safely parse and display formatted text containing:
 * - Single Images ![caption](url)
 * - Image Carousels :::carousel ... ::: or [carousel: url1, url2]
 * - HTML elements (<b>, <i>, <strong>, <em>, <a>, <h2>, <h3>, <ul>, <ol>, <li>, <blockquote>, <p>, <br>)
 * - Markdown links [text](url)
 * - Markdown bold **text** and italic *text*
 * - Headings ## and ###
 * - Bullet lists (- item) and numbered lists (1. item)
 */
export default function FormattedText({ content = '', className = '' }) {
  const [modalImage, setModalImage] = useState(null);

  if (!content) return null;

  // Function to process markdown syntax into standard React nodes or safe markup
  const parseMarkdownAndHtml = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let listType = null;
    let carouselBuffer = null;

    const flushList = () => {
      if (currentList && currentList.length > 0) {
        if (listType === 'ol') {
          elements.push(
            <ol key={`ol-${elements.length}`} className="list-decimal list-inside my-3 space-y-1 pl-2">
              {currentList.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`} className="list-disc list-inside my-3 space-y-1 pl-2">
              {currentList.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ul>
          );
        }
        currentList = null;
        listType = null;
      }
    };

    const flushCarousel = () => {
      if (carouselBuffer && carouselBuffer.length > 0) {
        elements.push(
          <ImageCarousel key={`carousel-${elements.length}`} images={carouselBuffer} />
        );
        carouselBuffer = null;
      }
    };

    let inCarouselBlock = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check for start/end of :::carousel block
      if (trimmed === ':::carousel') {
        flushList();
        inCarouselBlock = true;
        carouselBuffer = [];
        return;
      }

      if (inCarouselBlock) {
        if (trimmed === ':::' || trimmed === ':::endcarousel') {
          inCarouselBlock = false;
          flushCarousel();
          return;
        }

        if (trimmed !== '') {
          // Parse image syntax or raw URL inside carousel block
          const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
          if (imgMatch) {
            carouselBuffer.push({ alt: imgMatch[1], url: imgMatch[2] });
          } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
            carouselBuffer.push({ alt: '', url: trimmed });
          }
        }
        return;
      }

      // Check for inline carousel directive: [carousel: url1, url2] or [carousel: ![alt](url1), ![alt](url2)]
      const inlineCarouselMatch = trimmed.match(/^\[carousel:(.+)\]$/i);
      if (inlineCarouselMatch) {
        flushList();
        const rawItems = inlineCarouselMatch[1].split(',');
        const parsedImages = rawItems.map((raw) => {
          const item = raw.trim();
          const imgMatch = item.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
          if (imgMatch) {
            return { alt: imgMatch[1], url: imgMatch[2] };
          }
          return { alt: '', url: item };
        }).filter(img => img.url);

        if (parsedImages.length > 0) {
          elements.push(<ImageCarousel key={`carousel-${index}`} images={parsedImages} />);
          return;
        }
      }

      // Check for single markdown image line: ![alt](url)
      const singleImgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (singleImgMatch) {
        flushList();
        const alt = singleImgMatch[1];
        const url = singleImgMatch[2];
        elements.push(
          <div key={`img-${index}`} className="my-6 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-md bg-surface-container-low">
            <div 
              className="relative cursor-zoom-in group overflow-hidden"
              onClick={() => setModalImage({ alt, url })}
            >
              <img
                src={url}
                alt={alt || 'Image d\'article'}
                className="w-full h-auto max-h-[480px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 text-white p-2.5 rounded-full flex items-center gap-2 text-xs font-medium backdrop-blur-sm">
                  <span className="material-symbols-outlined text-base">zoom_in</span>
                  Cliquer pour agrandir
                </span>
              </div>
            </div>
            {alt && (
              <p className="p-3 text-center text-xs text-on-surface-variant italic bg-surface-container-high/40 border-t border-outline-variant/15">
                {alt}
              </p>
            )}
          </div>
        );
        return;
      }

      // Check for headings
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-headline-sm text-xl font-bold text-primary mt-6 mb-3" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(4)) }} />
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-headline-md text-2xl font-bold text-primary mt-8 mb-4 border-b border-primary/10 pb-2" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(3)) }} />
        );
        return;
      }

      // Check for blockquotes
      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={index} className="border-l-4 border-primary pl-4 py-2 italic bg-primary/5 rounded-r-lg my-4 text-on-surface" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
        );
        return;
      }

      // Check for unordered lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (listType !== 'ul') flushList();
        listType = 'ul';
        if (!currentList) currentList = [];
        currentList.push(trimmed.slice(2));
        return;
      }

      // Check for ordered lists (1. 2. etc.)
      const numListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numListMatch) {
        if (listType !== 'ol') flushList();
        listType = 'ol';
        if (!currentList) currentList = [];
        currentList.push(numListMatch[2]);
        return;
      }

      // If normal line
      flushList();
      if (trimmed === '') {
        elements.push(<div key={index} className="h-3" />);
      } else {
        elements.push(
          <p key={index} className="my-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      }
    });

    flushList();
    if (inCarouselBlock) {
      flushCarousel();
    }
    return elements;
  };

  // Format inline elements: bold, italic, links, inline images
  const formatInline = (rawText) => {
    let result = rawText;

    // Convert inline markdown images: ![alt](url)
    result = result.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="inline-block max-h-60 rounded-xl my-2 border border-outline-variant/20 shadow-sm" />'
    );

    // Convert markdown links: [text](url) -> <a href="url" target="_blank" rel="noopener noreferrer" class="...">text</a>
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold underline underline-offset-2 hover:text-primary-fixed-dim transition-colors">$1</a>'
    );

    // Convert bold: **text** or __text__ -> <strong>text</strong>
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Convert italic: *text* or _text_ -> <em>text</em>
    result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    result = result.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Convert inline code: `code` -> <code>code</code>
    result = result.replace(/`([^`]+)`/g, '<code class="bg-surface-container-high px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>');

    return result;
  };

  return (
    <>
      <div className={`formatted-content text-on-surface-variant ${className}`}>
        {parseMarkdownAndHtml(content)}
      </div>

      {/* Lightbox pour image unique */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
        >
          <button
            type="button"
            onClick={() => setModalImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 transition-colors z-10"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.url}
              alt={modalImage.alt || 'Agrandissement'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {modalImage.alt && (
              <p className="text-white/90 text-sm mt-3 text-center italic bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                {modalImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

