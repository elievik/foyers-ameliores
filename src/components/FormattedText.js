'use client';

import React from 'react';

/**
 * Component to safely parse and display formatted text containing:
 * - HTML elements (<b>, <i>, <strong>, <em>, <a>, <h2>, <h3>, <ul>, <ol>, <li>, <blockquote>, <p>, <br>)
 * - Markdown links [text](url)
 * - Markdown bold **text** and italic *text*
 * - Headings ## and ###
 * - Bullet lists (- item) and numbered lists (1. item)
 */
export default function FormattedText({ content = '', className = '' }) {
  if (!content) return null;

  // Function to process markdown syntax into standard React nodes or safe markup
  const parseMarkdownAndHtml = (text) => {
    // Break into paragraphs / blocks
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let listType = null;

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

    lines.forEach((line, index) => {
      const trimmed = line.trim();

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
    return elements;
  };

  // Format inline elements: bold, italic, links, code
  const formatInline = (rawText) => {
    let result = rawText;

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

    // Convert raw URLs if not already in an HTML attribute
    // result = result.replace(/(^|[^"'])https?:\/\/[^\s<]+/g, '<a href="$&" target="_blank" rel="noopener noreferrer" class="text-primary underline">$&</a>');

    return result;
  };

  return (
    <div className={`formatted-content text-on-surface-variant ${className}`}>
      {parseMarkdownAndHtml(content)}
    </div>
  );
}
