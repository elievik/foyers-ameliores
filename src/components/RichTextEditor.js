'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import FormattedText from './FormattedText';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

/**
 * Convertit un contenu markdown existant en HTML pour l'affichage WYSIWYG
 */
function markdownToHtml(content) {
  if (!content) return '';
  let html = content;

  // Convertir le gras markdown: **texte** ou __texte__ -> <strong>texte</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Convertir l'italique markdown: *texte* ou _texte_ -> <em>texte</em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convertir les liens markdown: [texte](url) -> <a href="url">texte</a>
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold underline">$1</a>'
  );

  // Si c'est du markdown pur sans balises de paragraphe / div
  if (!html.includes('<p>') && !html.includes('<div>') && !html.includes('<h2') && !html.includes('<h3')) {
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<br>';
      if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith('> ')) return `<blockquote>${trimmed.slice(2)}</blockquote>`;
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return `<li>${trimmed.slice(2)}</li>`;
      return `<p>${line}</p>`;
    });
    html = processedLines.join('');
  }

  return html;
}

export default function RichTextEditor({ value = '', onChange, placeholder = "Rédigez le contenu de votre article ici..." }) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const editorRef = useRef(null);
  const isInternalChangeRef = useRef(false);
  const savedSelectionRef = useRef(null);

  // --- Système d'historique Undo / Redo (Ctrl+Z / Ctrl+Y) ---
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const lastRecordedHtmlRef = useRef('');
  const debounceTimerRef = useRef(null);

  // États pour les boutons actifs (gras, italique, etc.)
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    quote: false,
  });

  // États des modales
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  const [carouselError, setCarouselError] = useState('');

  // Initialisation de la référence initiale
  useEffect(() => {
    if (editorRef.current && !lastRecordedHtmlRef.current) {
      lastRecordedHtmlRef.current = editorRef.current.innerHTML || '';
    }
  }, []);

  // Enregistrer immédiatement un snapshot dans l'historique avant une modification
  const recordSnapshotBeforeChange = () => {
    if (editorRef.current) {
      const current = editorRef.current.innerHTML;
      if (current !== lastRecordedHtmlRef.current) {
        undoStackRef.current = [...undoStackRef.current.slice(-40), lastRecordedHtmlRef.current];
        redoStackRef.current = [];
        lastRecordedHtmlRef.current = current;
        setCanUndo(true);
        setCanRedo(false);
      }
    }
  };

  // Annuler (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0 || !editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    const previousHtml = undoStackRef.current.pop();

    redoStackRef.current.push(currentHtml);
    lastRecordedHtmlRef.current = previousHtml;

    editorRef.current.innerHTML = previousHtml;
    editorRef.current.focus();

    isInternalChangeRef.current = true;
    if (onChange) onChange(previousHtml);

    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(true);
    updateActiveFormats();
  }, [onChange]);

  // Rétablir (Ctrl+Y / Ctrl+Shift+Z)
  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0 || !editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    const nextHtml = redoStackRef.current.pop();

    undoStackRef.current.push(currentHtml);
    lastRecordedHtmlRef.current = nextHtml;

    editorRef.current.innerHTML = nextHtml;
    editorRef.current.focus();

    isInternalChangeRef.current = true;
    if (onChange) onChange(nextHtml);

    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
    updateActiveFormats();
  }, [onChange]);

  // Interception clavier de Ctrl+Z, Cmd+Z, Ctrl+Y, Cmd+Shift+Z
  const handleEditorKeyDown = (e) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd) {
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleRedo();
        return;
      }
    }
  };

  // Mettre à jour l'état actif des boutons
  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isUl = document.queryCommandState('insertUnorderedList');
      const isOl = document.queryCommandState('insertOrderedList');
      const block = document.queryCommandValue('formatBlock') || '';

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        h2: block.toLowerCase() === 'h2',
        h3: block.toLowerCase() === 'h3',
        ul: isUl,
        ol: isOl,
        quote: block.toLowerCase() === 'blockquote',
      });
    } catch (e) {
      // Ignorer
    }
  }, []);

  // Synchronisation avec la valeur externe
  useEffect(() => {
    if (editorRef.current && activeTab === 'edit') {
      if (!isInternalChangeRef.current) {
        const targetHtml = markdownToHtml(value || '');
        if (editorRef.current.innerHTML !== targetHtml) {
          editorRef.current.innerHTML = targetHtml;
          lastRecordedHtmlRef.current = targetHtml;
        }
      }
      isInternalChangeRef.current = false;
    }
  }, [value, activeTab]);

  // Sauvegarder la sélection actuelle
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelectionRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Gestionnaire de frappe dans l'éditeur
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    isInternalChangeRef.current = true;
    const currentHtml = editorRef.current.innerHTML;

    if (onChange) {
      onChange(currentHtml);
    }
    updateActiveFormats();

    // Enregistrement périodique dans l'historique Undo (avec debounce de 450ms)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (currentHtml !== lastRecordedHtmlRef.current) {
        undoStackRef.current = [...undoStackRef.current.slice(-40), lastRecordedHtmlRef.current];
        redoStackRef.current = [];
        lastRecordedHtmlRef.current = currentHtml;
        setCanUndo(true);
        setCanRedo(false);
      }
    }, 450);
  };

  // Exécution d'une commande de mise en forme WYSIWYG
  const executeCommand = (command, val = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    recordSnapshotBeforeChange();

    try {
      document.execCommand(command, false, val);
    } catch (err) {
      console.warn('execCommand failed:', err);
    }

    handleEditorInput();
    updateActiveFormats();
  };

  // --- Téléversement direct sur le serveur pour éviter les base64 énormes ---
  const uploadImageToServer = async (file) => {
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append('file', compressed);

    const res = await fetch(`${BACKEND_URL}/api/media/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || 'Erreur lors du téléversement vers le serveur');
    }

    const data = await res.json();
    return data.url; // Retourne l'URL courte et permanente (ex: https://.../photo.jpg)
  };

  // --- Modal Lien ---
  const handleOpenLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : '';
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
      recordSnapshotBeforeChange();

      const text = linkText.trim() || linkUrl.trim();
      const linkHtml = `<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold underline">${text}</a>`;
      
      try {
        document.execCommand('insertHTML', false, linkHtml);
      } catch (err) {
        document.execCommand('createLink', false, linkUrl.trim());
      }

      handleEditorInput();
    }

    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
  };

  // --- Insertion d'image ---
  const handleOpenImageModal = () => {
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setImageError('');
    setShowImageModal(true);
  };

  const insertImageHtml = (url, alt) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    recordSnapshotBeforeChange();

    const imgHtml = `
      <div class="my-4 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-md bg-surface-container-low max-w-2xl">
        <img src="${url}" alt="${alt || 'Image d\'article'}" class="w-full h-auto max-h-[480px] object-cover" />
        ${alt ? `<p class="p-2.5 text-center text-xs text-on-surface-variant italic bg-surface-container-high/40 border-t border-outline-variant/15">${alt}</p>` : ''}
      </div><p><br></p>
    `;

    try {
      document.execCommand('insertHTML', false, imgHtml);
    } catch (e) {
      editorRef.current.innerHTML += imgHtml;
    }
    handleEditorInput();
  };

  const handleSingleImageFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImage(true);
    setImageError('');
    try {
      for (const file of files.slice(0, 5)) {
        // Envoi au serveur pour obtenir une URL courte permanente
        const serverUrl = await uploadImageToServer(file);
        const altName = file.name.replace(/\.[^/.]+$/, "");
        insertImageHtml(serverUrl, altName);
      }
      setIsUploadingImage(false);
      setShowImageModal(false);
    } catch (err) {
      console.error("Erreur téléversement image:", err);
      setImageError(err.message || 'Erreur lors de l\'envoi de l\'image au serveur');
      setIsUploadingImage(false);
    }
  };

  const handleAddSingleImage = (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    insertImageHtml(imageUrl.trim(), imageAlt.trim());
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  // --- Modal Carrousel ---
  const handleOpenCarouselModal = () => {
    saveSelection();
    setCarouselItems([]);
    setCarouselError('');
    setShowCarouselModal(true);
  };

  const handleCarouselFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingCarousel(true);
    setCarouselError('');
    try {
      const newItems = [];
      for (const file of files) {
        // Envoi de chaque photo au serveur pour obtenir une URL courte
        const serverUrl = await uploadImageToServer(file);
        newItems.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          url: serverUrl,
          alt: file.name.replace(/\.[^/.]+$/, "")
        });
      }
      setCarouselItems((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error("Erreur carrousel:", err);
      setCarouselError(err.message || 'Erreur lors de l\'envoi des photos');
    } finally {
      setIsUploadingCarousel(false);
    }
  };

  const handleInsertCarousel = (e) => {
    e.preventDefault();
    const validItems = carouselItems.filter((item) => item.url.trim() !== '');
    if (validItems.length === 0) return;

    let carouselBlock = `\n\n:::carousel\n`;
    validItems.forEach((item) => {
      carouselBlock += `![${item.alt.trim()}](${item.url.trim()})\n`;
    });
    carouselBlock += `:::\n\n`;

    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
      recordSnapshotBeforeChange();

      const previewHtml = `
        <div class="my-4 p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center gap-3">
          <span class="material-symbols-outlined text-2xl text-primary">view_carousel</span>
          <div>
            <p class="font-bold text-sm text-primary">Carrousel d'images (${validItems.length} photos)</p>
            <p class="text-xs text-on-surface-variant">Affiché sous forme de diaporama interactif sur le site</p>
          </div>
        </div>
        <!--carouselsource:${encodeURIComponent(carouselBlock)}-->
        <p><br></p>
      `;

      try {
        document.execCommand('insertHTML', false, previewHtml);
      } catch (err) {
        editorRef.current.innerHTML += previewHtml;
      }
      handleEditorInput();
    }

    setShowCarouselModal(false);
    setCarouselItems([]);
  };

  return (
    <div className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-low transition-all shadow-sm">
      {/* Barre d'outils WYSIWYG */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 bg-surface-container-high/40 p-2">
        {activeTab === 'edit' ? (
          <div className="flex flex-wrap items-center gap-1">
            {/* BOUTON ANNULER (Ctrl+Z) */}
            <button
              type="button"
              title="Annuler (Ctrl+Z / Cmd+Z)"
              disabled={!canUndo}
              onMouseDown={(e) => {
                e.preventDefault();
                handleUndo();
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center text-sm ${
                canUndo
                  ? 'text-on-surface hover:bg-surface-container-highest hover:text-primary cursor-pointer'
                  : 'text-on-surface-variant/30 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-lg">undo</span>
            </button>

            {/* BOUTON RÉTABLIR (Ctrl+Y / Cmd+Shift+Z) */}
            <button
              type="button"
              title="Rétablir (Ctrl+Y / Cmd+Shift+Z)"
              disabled={!canRedo}
              onMouseDown={(e) => {
                e.preventDefault();
                handleRedo();
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center text-sm ${
                canRedo
                  ? 'text-on-surface hover:bg-surface-container-highest hover:text-primary cursor-pointer'
                  : 'text-on-surface-variant/30 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-lg">redo</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            {/* BOUTON GRAS DIRECT */}
            <button
              type="button"
              title="Gras direct (Ctrl+B / Cmd+B)"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('bold');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center font-bold text-sm ${
                activeFormats.bold
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_bold</span>
            </button>

            {/* BOUTON ITALIQUE DIRECT */}
            <button
              type="button"
              title="Italique direct (Ctrl+I / Cmd+I)"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('italic');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center italic text-sm ${
                activeFormats.italic
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_italic</span>
            </button>

            {/* BOUTON SOULIGNÉ */}
            <button
              type="button"
              title="Souligné (Ctrl+U)"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('underline');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center text-sm ${
                activeFormats.underline
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_underlined</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            {/* Titre H2 */}
            <button
              type="button"
              title="Grand Titre de section"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('formatBlock', activeFormats.h2 ? '<p>' : '<h2>');
              }}
              className={`p-2 rounded-lg transition-all text-xs font-semibold flex items-center gap-0.5 ${
                activeFormats.h2
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">title</span>
              <span>2</span>
            </button>

            {/* Sous-titre H3 */}
            <button
              type="button"
              title="Sous-titre"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('formatBlock', activeFormats.h3 ? '<p>' : '<h3>');
              }}
              className={`p-2 rounded-lg transition-all text-xs font-semibold flex items-center gap-0.5 ${
                activeFormats.h3
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">title</span>
              <span>3</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            {/* Insérer un lien */}
            <button
              type="button"
              title="Insérer un lien"
              onClick={handleOpenLinkModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">link</span>
            </button>

            {/* Insérer une image */}
            <button
              type="button"
              title="Insérer une image dans le texte"
              onClick={handleOpenImageModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-1 text-xs font-medium"
            >
              <span className="material-symbols-outlined text-lg">image</span>
              <span className="hidden sm:inline">Image</span>
            </button>

            {/* Insérer un carrousel */}
            <button
              type="button"
              title="Insérer un carrousel d'images"
              onClick={handleOpenCarouselModal}
              className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-1 text-xs font-medium bg-primary/10 text-primary"
            >
              <span className="material-symbols-outlined text-lg">view_carousel</span>
              <span>Carrousel</span>
            </button>

            <div className="w-[1px] h-6 bg-outline-variant/30 mx-1" />

            {/* Liste à puces */}
            <button
              type="button"
              title="Liste à puces"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('insertUnorderedList');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                activeFormats.ul
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
            </button>

            {/* Liste numérotée */}
            <button
              type="button"
              title="Liste numérotée"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('insertOrderedList');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                activeFormats.ol
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_list_numbered</span>
            </button>

            {/* Citation */}
            <button
              type="button"
              title="Citation"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('formatBlock', activeFormats.quote ? '<p>' : '<blockquote>');
              }}
              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                activeFormats.quote
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                  : 'text-on-surface hover:bg-surface-container-highest hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">format_quote</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-label-caps text-on-surface-variant px-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">visibility</span>
            <span>Aperçu en direct (rendu public)</span>
          </div>
        )}

        {/* Sélecteur de mode */}
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

      {/* Zone de saisie principale */}
      {activeTab === 'edit' ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onKeyDown={handleEditorKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className="wysiwyg-editor w-full bg-surface-container-lowest/50 p-4 text-on-surface focus:outline-none min-h-[240px] max-h-[600px] overflow-y-auto text-sm leading-relaxed"
          data-placeholder={placeholder}
          style={{ minHeight: '220px' }}
        />
      ) : (
        <div className="p-5 min-h-[220px] max-h-[600px] overflow-y-auto bg-white/70">
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
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Texte du lien (libellé)
                </label>
                <input
                  type="text"
                  placeholder="Ex: En savoir plus"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Adresse Web (URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 text-on-surface text-sm rounded-lg hover:bg-surface-container transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors"
                >
                  Insérer le lien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'insertion d'image simple */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                Insérer une image dans l'article
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSingleImage} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Téléverser depuis votre appareil (stocké sur le serveur)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSingleImageFileUpload}
                  disabled={isUploadingImage}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                />
                {isUploadingImage && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium animate-pulse">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Optimisation et téléversement sur le serveur...</span>
                  </div>
                )}
                {imageError && (
                  <p className="text-xs text-error mt-1.5">{imageError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="h-[1px] bg-outline-variant/30 flex-grow"></div>
                <span className="text-xs text-on-surface-variant uppercase font-label-caps">Ou via une URL directe</span>
                <div className="h-[1px] bg-outline-variant/30 flex-grow"></div>
              </div>

              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Adresse URL de l'image
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Légende / Texte alternatif (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Distribution des foyers à Kara"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 text-on-surface text-sm rounded-lg hover:bg-surface-container transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl || isUploadingImage}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors"
                >
                  Insérer l'image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'insertion de carrousel */}
      {showCarouselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">view_carousel</span>
                Créer un carrousel de photos
              </h4>
              <button
                type="button"
                onClick={() => setShowCarouselModal(false)}
                className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-xs uppercase font-label-caps text-on-surface-variant mb-1">
                  Téléverser plusieurs photos (3 à 5 ou plus, stockées sur le serveur)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCarouselFilesUpload}
                  disabled={isUploadingCarousel}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                />
                {isUploadingCarousel && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium animate-pulse">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Téléversement et optimisation des photos sur le serveur...</span>
                  </div>
                )}
                {carouselError && (
                  <p className="text-xs text-error mt-1.5">{carouselError}</p>
                )}
              </div>

              {carouselItems.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs uppercase font-label-caps text-on-surface-variant">
                    Photos enregistrées ({carouselItems.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {carouselItems.map((item) => (
                      <div key={item.id} className="relative rounded-lg overflow-hidden border border-outline-variant/30 aspect-square group">
                        <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setCarouselItems(prev => prev.filter(i => i.id !== item.id))}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-error text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20 mt-4">
              <button
                type="button"
                onClick={() => setShowCarouselModal(false)}
                className="px-4 py-2 border border-outline-variant/30 text-on-surface text-sm rounded-lg hover:bg-surface-container transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleInsertCarousel}
                disabled={carouselItems.length === 0 || isUploadingCarousel}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors"
              >
                Insérer le carrousel ({carouselItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
