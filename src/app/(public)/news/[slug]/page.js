'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ArticleDetail({ params }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/news/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (error) {
        console.error('Erreur chargement de l\'article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-center">
        <p className="text-on-surface-variant">Chargement...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-center">
        <p className="text-on-surface-variant">Article non trouvé.</p>
        <Link href="/news" className="text-primary font-button mt-4 inline-block">Retour aux actualités</Link>
      </main>
    );
  }

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-caps text-label-caps">
        <Link className="hover:text-primary" href="/">Accueil</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link className="hover:text-primary" href="/news">Actualités</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-caps text-label-caps mb-4 uppercase tracking-wider shadow-sm">
          {article.status}
        </span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 max-w-4xl leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-body-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{article.region}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-8 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          <p className="text-xl font-medium text-primary mb-8 leading-relaxed italic">
            {article.content.split('. ')[0]}.
          </p>
          
          <p className="mb-6">{article.content}</p>
          
          {/* Sharing Buttons */}
          <div className="mt-12 pt-8 border-t border-outline-variant flex items-center gap-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Partager :</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">chat</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Key Figures */}
          <div className="bg-primary text-on-primary p-8 rounded-2xl shadow-xl space-y-8">
            <h3 className="font-headline-sm text-headline-sm border-b border-primary-fixed-dim pb-4">Chiffres Clés</h3>
            <div className="space-y-6">
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">45k+</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">FAMILLES IMPACTÉES</p>
              </div>
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">12.5t</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">DE BOIS SAUVÉS / MOIS</p>
              </div>
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">80%</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">MOINS DE FUMÉE TOXIQUE</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-headline-md text-primary">Articles Connexes</h2>
          <Link className="text-secondary font-button flex items-center gap-2 hover:translate-x-1 transition-transform" href="/news">
            Voir toute l'actualité <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
