'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function News() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [newsItems, setNewsItems] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, reportsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/news/`),
          fetch(`${BACKEND_URL}/api/reports/`)
        ]);
        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsItems(data);
        }
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData);
        }
      } catch (error) {
        console.error('Erreur chargement des actualités:', error);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email === 'foyer@gmail.com') {
      router.push('/login');
    } else {
      alert('Merci pour votre inscription !');
      setEmail('');
    }
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${url}`;
  };

  const featuredArticle = newsItems.find(item => item.featured === 1 && item.status === 'Publié') || 
                          newsItems.find(item => item.status === 'Publié');
  
  const publishedArticles = newsItems.filter(item => item.status === 'Publié');

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface"></div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">Journal du Changement</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Actualités & Impact sur le Terrain</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Découvrez les histoires inspirantes de transition énergétique à travers les 5 régions du Togo.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto -mt-20 relative z-20 mb-16">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic flex flex-col md:flex-row min-h-[400px] border border-outline-variant/30">
            <div className="md:w-1/2 relative overflow-hidden group min-h-[300px]">
              {(() => {
                const src = getFullUrl(featuredArticle.image_url);
                if (src) {
                  return (
                    <img 
                      src={src} 
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                }
                return (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-8xl text-primary/20">article</span>
                  </div>
                );
              })()}
              <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1 rounded-full font-label-caps text-label-caps">
                À la une
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">{featuredArticle.region}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  {new Date(featuredArticle.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary mb-6 leading-tight">{featuredArticle.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed line-clamp-4">
                {featuredArticle.content}
              </p>
              <div>
                <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`} className="inline-flex items-center gap-2 text-primary font-button group transition-all hover:translate-x-1">
                  Lire l'article complet
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <h3 className="font-headline-md text-headline-md text-primary mb-8">Tous les articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {publishedArticles.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic flex flex-col group h-full border border-outline-variant/30 transition-all hover:-translate-y-1">
              <div className="h-56 overflow-hidden relative bg-surface-container flex items-center justify-center">
                {(() => {
                const src = getFullUrl(item.image_url);
                if (src) {
                  return (
                    <img 
                      src={src} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                }
                return (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary/20">article</span>
                  </div>
                );
              })()}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-label-caps text-secondary uppercase">{item.region}</span>
                  <span className="font-label-caps text-label-caps text-outline">
                    {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary mb-4">{item.title}</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">
                  {item.content}
                </p>
                <div className="mt-auto">
                  <Link href={`/news/${item.slug || item.id}`} className="text-primary font-button flex items-center gap-1 hover:gap-2 transition-all">
                    Lire la suite <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rapports d'Impact Section */}
      {reports.length > 0 && (
        <section className="bg-surface-container-low py-24 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">Transparence & Résultats</span>
                <h2 className="font-headline-md text-headline-md text-primary mb-6">Rapports d'Impact et Données de Terrain</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
                  Nous croyons en la force des chiffres. Consultez nos rapports détaillés.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reports.map((report) => (
                    <a 
                      key={report.id} 
                      href={getFullUrl(report.file_url)} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface p-6 rounded-lg border border-outline-variant hover:border-primary transition-all group cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-4xl">picture_as_pdf</span>
                        <div>
                          <h4 className="font-button text-on-surface">{report.title}</h4>
                          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">{report.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="material-symbols-outlined text-primary group-hover:translate-y-1 transition-transform">download</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary p-8 rounded-2xl text-center flex flex-col items-center justify-center h-48 shadow-organic">
                  <div className="font-display-lg text-[42px] mb-2 text-secondary-fixed-dim">{newsItems.length}</div>
                  <div className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 text-secondary-fixed-dim">Articles publiés</div>
                </div>
                <div className="bg-surface-container-highest p-8 rounded-2xl text-center flex flex-col items-center justify-center h-48 shadow-organic mt-12">
                  <div className="font-display-lg text-[42px] mb-2 text-secondary">{reports.length}</div>
                  <div className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 text-secondary">Rapports</div>
                </div>
                <div className="bg-surface-container-highest p-8 rounded-2xl text-center flex flex-col items-center justify-center h-48 shadow-organic -mt-12">
                  <div className="font-display-lg text-[42px] mb-2 text-secondary">5</div>
                  <div className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 text-secondary">Régions</div>
                </div>
                <div className="bg-primary-container p-8 rounded-2xl text-center flex flex-col items-center justify-center h-48 shadow-organic">
                  <div className="font-display-lg text-[42px] mb-2 text-on-primary-container">100%</div>
                  <div className="font-label-caps text-label-caps uppercase tracking-widest opacity-80 text-on-primary-container">Transparence</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center border border-outline-variant shadow-organic">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Restez informés de la révolution verte</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            Inscrivez-vous à notre newsletter mensuelle pour recevoir les dernières actualités.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4">
            <input 
              className="flex-grow bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 font-body-md transition-all outline-none" 
              placeholder="votre@email.com" 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-button text-button hover:brightness-110 transition-all shadow-md" type="submit">
              S'abonner maintenant
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
