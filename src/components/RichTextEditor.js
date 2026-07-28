'use client';

import React, { useState, useRef } from 'react';
import FormattedText from './FormattedText';

export default function RichTextEditor({ value, onChange, placeholder = "Contenu de l'article..." }) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
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

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = 
        value.substring(0, start) + 
        markdownLink + 
        value.substring(end);

      onChange(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdownLink.length, start + markdownLink.length);
      }, 50);
    } else {
      onChange(value + (value ? ' ' : '') + markdownLink);
    }

    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
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
        <div className="p-5 min-h-[220px] max-h-[450px] overflow-y-auto bg-white/60">
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
    </div>
  );
}
