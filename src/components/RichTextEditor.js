'use client';

import React, { useState, useRef } from 'react';
import FormattedText from './FormattedText';
import { compressImage } from '@/utils/imageCompression';

export default function RichTextEditor({ value, onChange, placeholder = "Contenu de l'article..." }) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  
  // Link Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Single Image Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Carousel Modal State
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]); // [{ url, alt, id }]
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);

  const textareaRef = useRef(null);

  const applyFormatting = (before, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const newContent = 
      value.substring(0, start) + 
      before + selectedText + after + 
      value.substring(end);

    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  const insertTextAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = 
        value.substring(0, start) + 
        textToInsert + 
        value.substring(end);

      onChange(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 50);
    } else {
      onChange(value + '\n\n' + textToInsert);
    }
  };

  // --- Link Handlers ---
  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      setLinkText(selected);
    } else {
      setLinkText('');
    }
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    const textToInsert = linkText.trim() || linkUrl;
    const markdownLink = `[${textToInsert}](${linkUrl})`;
    insertTextAtCursor(markdownLink);

    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
  };

  // --- Single Image Handlers ---
  const handleOpenImageModal = () => {
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(true);
  };

  const handleSingleImageFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImage(true);
    try {
      if (files.length === 1) {
        const compressed = await compressImage(files[0]);
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target.result);
          setIsUploadingImage(false);
        };
        reader.readAsDataURL(compressed);
      } else {
        // Envoi multiple (3 à 5 images ou plus)
        const selectedFiles = files.slice(0, 5); // Limite à 5 images max
        const markdownImages = [];

        for (const file of selectedFiles) {
          const compressed = await compressImage(file);
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(compressed);
          });
          const altName = file.name.replace(/\.[^/.]+$/, "");
          markdownImages.push(`![${altName}](${dataUrl})`);
        }

        const formattedMarkdown = `\n\n${markdownImages.join('\n\n')}\n\n`;
        insertTextAtCursor(formattedMarkdown);
        setIsUploadingImage(false);
        setShowImageModal(false);
        setImageUrl('');
        setImageAlt('');
      }
    } catch (err) {
      console.error("Erreur compression d'image:", err);
      setIsUploadingImage(false);
    }
  };

  const handleAddSingleImage = (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    const markdownImg = `\n\n![${imageAlt.trim()}](${imageUrl.trim()})\n\n`;
    insertTextAtCursor(markdownImg);

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  // --- Carousel Handlers ---
  const handleOpenCarouselModal = () => {
    setCarouselItems([]);
    setShowCarouselModal(false);
    setShowCarouselModal(true);
  };

  const handleCarouselFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingCarousel(true);
    try {
      const newItems = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(compressed);
        });
        newItems.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          url: dataUrl,
          alt: file.name.replace(/\.[^/.]+$/, "") // default caption to file name without extension
        });
      }
      setCarouselItems((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error("Erreur ajout d'images carrousel:", err);
    } finally {
      setIsUploadingCarousel(false);
    }
  };

  const handleAddCarouselUrl = () => {
    setCarouselItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        url: '',
        alt: ''
      }
    ]);
  };

  const handleUpdateCarouselItem = (id, field, value) => {
    setCarouselItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveCarouselItem = (id) => {
    setCarouselItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveCarouselItem = (index, direction) => {
    const newItems = [...carouselItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setCarouselItems(newItems);
  };

  const handleInsertCarousel = (e) => {
    e.preventDefault();
    const validItems = carouselItems.filter((item) => item.url.trim() !== '');
    if (validItems.length === 0) return;

    let markdownCarousel = `\n\n:::carousel\n`;
    validItems.forEach((item) => {
      markdownCarousel += `![${item.alt.trim()}](${item.url.trim()})\n`;
    });
    markdownCarousel += `:::\n\n`;

    insertTextAtCursor(markdownCarousel);
    setShowCarouselModal(false);
    setCarouselItems([]);
  };

  return (
    <div className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-low transition-all">
      {/* Header Tabs & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 bg-surface-container-high/40 p-2">
        {/* Toolbar items */}
        {activeTab === 'edit' ? (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              title="Gras (**texte**)"
              onClick={() => applyFormatting('**', '**', 'texte en gras')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center font-bold text-sm"
            >
              <span className="material-symbols-outlined text-lg">format_bold</span>
            </button>
            <button
              type="button"
              title="Italique (*texte*)"
              onClick={() => applyFormatting('*', '*', 'texte en italique')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center italic text-sm"
            >
              <span className="material-symbols-outlined text-lg">format_italic</span>
            </button>
            
            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            <button
              type="button"
              title="Titre de section (H2)"
              onClick={() => applyFormatting('\n## ', '', 'Titre de section')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors font-semibold text-xs flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-lg">title</span>
              <span>2</span>
            </button>

            <button
              type="button"
              title="Sous-titre (H3)"
              onClick={() => applyFormatting('\n### ', '', 'Sous-titre')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors font-medium text-xs flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-lg">title</span>
              <span>3</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            <button
              type="button"
              title="Ajouter un lien"
              onClick={handleOpenLinkModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">link</span>
            </button>

            <button
              type="button"
              title="Insérer une image dans le texte"
              onClick={handleOpenImageModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-1 text-xs font-medium"
            >
              <span className="material-symbols-outlined text-lg">image</span>
              <span className="hidden sm:inline">Image</span>
            </button>

            <button
              type="button"
              title="Insérer un carrousel d'images dans le texte"
              onClick={handleOpenCarouselModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-1 text-xs font-medium bg-primary/10 text-primary"
            >
              <span className="material-symbols-outlined text-lg">view_carousel</span>
              <span>Carrousel</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            <button
              type="button"
              title="Liste à puces"
              onClick={() => applyFormatting('\n- ', '', 'Élément de liste')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
            </button>

            <button
              type="button"
              title="Liste numérotée"
              onClick={() => applyFormatting('\n1. ', '', 'Premier élément')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">format_list_numbered</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            <button
              type="button"
              title="Citation"
              onClick={() => applyFormatting('\n> ', '', 'Texte en citation')}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">format_quote</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-label-caps text-on-surface-variant px-2">
            Aperçu en temps réel
          </div>
        )}

        {/* View mode switcher */}
        <div className="flex bg-surface-container rounded-lg p-0.5 text-xs font-medium ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'edit'
                ? 'bg-white shadow text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Éditeur
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white shadow text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Aperçu
          </button>
        </div>
      </div>

      {/* Editor or Preview view */}
      {activeTab === 'edit' ? (
        <textarea
          ref={textareaRef}
          required
          rows={10}
          className="w-full bg-transparent border-none p-4 text-on-surface focus:outline-none focus:ring-0 resize-y min-h-[220px] font-mono text-sm leading-relaxed"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="p-5 min-h-[220px] max-h-[550px] overflow-y-auto bg-white/60">
          {value ? (
            <FormattedText content={value} />
          ) : (
            <p className="text-on-surface-variant italic text-sm">Rien à afficher pour le moment...</p>
          )}
        </div>
      )}

      {/* Modal d'insertion de lien */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">link</span>
                Insérer un lien
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Texte du lien (libellé)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cliquez ici ou Consulter la fiche"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLink(e);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Adresse Web (URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://exemple.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLink(e);
                    }
                  }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-button bg-surface-container text-on-surface"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="flex-1 py-2 rounded-xl text-sm font-button bg-primary text-white hover:brightness-110"
                >
                  Insérer le lien
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'insertion d'une image unique */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                Insérer une Image dans le texte
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Téléverser des images (1 à 5 images)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSingleImageFileUpload}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
                {isUploadingImage && (
                  <p className="text-xs text-primary mt-1 animate-pulse">Compression et traitement des images en cours...</p>
                )}
              </div>

              <div className="text-center text-xs font-bold text-on-surface-variant/60 uppercase">OU</div>

              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  URL de l'image *
                </label>
                <input
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {imageUrl && (
                <div className="h-32 rounded-lg overflow-hidden border border-outline-variant/20 bg-black/5 flex items-center justify-center relative">
                  <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Légende / Description de l'image (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Distribution des foyers à Kara..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-button bg-surface-container text-on-surface"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={!imageUrl || isUploadingImage}
                  onClick={handleAddSingleImage}
                  className="flex-1 py-2.5 rounded-xl text-sm font-button bg-primary text-white hover:brightness-110 disabled:opacity-50"
                >
                  Insérer l'image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'insertion d'un Carrousel Multi-Images */}
      {showCarouselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-outline-variant/20 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/20">
              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">view_carousel</span>
                  Créer un Carrousel d'Images
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Ajoutez plusieurs images qui défileront sous forme de galerie interactive dans le texte.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCarouselModal(false)}
                className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content area: Upload options & image list */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-2xl hover:bg-primary/5 cursor-pointer transition-colors text-center group">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1 group-hover:scale-110 transition-transform">add_photo_alternate</span>
                  <span className="text-xs font-semibold text-primary">Téléverser plusieurs fichiers</span>
                  <span className="text-[10px] text-on-surface-variant">Sélectionnez une ou plusieurs images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleCarouselFilesUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAddCarouselUrl}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline-variant/40 rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors text-center group"
                >
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-1 group-hover:scale-110 transition-transform">link</span>
                  <span className="text-xs font-semibold text-on-surface">Ajouter une URL d'image</span>
                  <span className="text-[10px] text-on-surface-variant">Saisir le lien vers l'image</span>
                </button>
              </div>

              {isUploadingCarousel && (
                <div className="p-3 bg-primary/10 rounded-xl text-xs text-primary font-medium text-center animate-pulse flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Compression et préparation des images...
                </div>
              )}

              {/* Items List */}
              {carouselItems.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant uppercase px-1">
                    <span>Images ajoutées ({carouselItems.length})</span>
                    <span>Reordonner / Légendes</span>
                  </div>

                  {carouselItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low flex flex-col sm:flex-row items-center gap-3 shadow-xs transition-all hover:border-primary/40"
                    >
                      {/* Image Thumbnail / Input */}
                      <div className="w-full sm:w-24 h-20 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-outline-variant/20 flex items-center justify-center relative group">
                        {item.url ? (
                          <img src={item.url} alt={`Visual ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant/40">image</span>
                        )}
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="url"
                          placeholder="URL de l'image (https://...)"
                          value={item.url}
                          onChange={(e) => handleUpdateCarouselItem(item.id, 'url', e.target.value)}
                          className="w-full bg-white border border-outline-variant/30 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Légende / Description (ex: Vue du projet 1)..."
                          value={item.alt}
                          onChange={(e) => handleUpdateCarouselItem(item.id, 'alt', e.target.value)}
                          className="w-full bg-white border border-outline-variant/30 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex sm:flex-col items-center gap-1 shrink-0 ml-auto">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCarouselItem(idx, -1)}
                          className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant disabled:opacity-30"
                          title="Déplacer vers le haut"
                        >
                          <span className="material-symbols-outlined text-base">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === carouselItems.length - 1}
                          onClick={() => handleMoveCarouselItem(idx, 1)}
                          className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant disabled:opacity-30"
                          title="Déplacer vers le bas"
                        >
                          <span className="material-symbols-outlined text-base">arrow_downward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselItem(item.id)}
                          className="p-1 hover:bg-error/10 text-error rounded transition-colors"
                          title="Supprimer cette image"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant/30 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/40">collections</span>
                  <p className="text-xs font-medium">Aucune image dans le carrousel pour l'instant.</p>
                  <p className="text-[11px] opacity-70 mt-0.5">Téléversez des images ou saisissez des URLs d'images ci-dessus.</p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 border-t border-outline-variant/20 mt-2">
              <button
                type="button"
                onClick={() => setShowCarouselModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-button bg-surface-container text-on-surface"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={carouselItems.filter((i) => i.url.trim() !== '').length === 0 || isUploadingCarousel}
                onClick={handleInsertCarousel}
                className="flex-1 py-2.5 rounded-xl text-sm font-button bg-primary text-white hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">view_carousel</span>
                Insérer le Carrousel ({carouselItems.filter((i) => i.url.trim() !== '').length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

