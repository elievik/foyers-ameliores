'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Regions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState(null);

  const fetchHeroImage = async () => {
    try {
      const res = await fetch('/api/hero-images/regions');
      if (res.ok) {
        setHeroImage(await res.json());
      }
    } catch (e) {
      console.error('Error fetching hero image:', e);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await fetch('/api/regions/');
      const data = await res.json();
      setRegions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchHeroImage();
  }, []);

  const safeRegions = Array.isArray(regions) ? regions : [];
  const filteredRegions = safeRegions.filter(region => 
    region.is_hidden !== 1 && region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="text-center text-on-surface-variant">Chargement...</div>
      </main>
    );
  }

  return (
    <>
      {/* Hero Section with Blurred Background */}
      <section className="relative w-full overflow-hidden">
        {heroImage?.image_url && (
          <div className="absolute inset-0 z-0">
            <Image 
              className="w-full h-full object-cover" 
              alt={heroImage.alt_text || "Bannière Régions"} 
              src={heroImage.image_url} 
              fill
              sizes="100vw"
              priority
            />
            {/* Blur and overlay to ensure text is readable */}
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-md"></div>
          </div>
        )}
        
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Notre Impact au Togo</h1>
          <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl">
            Des savanes du Nord aux plaines côtières, notre réseau d'agents locaux et nos technologies durables transforment la façon dont le Togo cuisine. Explorez nos données régionales et les histoires de nos communautés.
          </p>
          {/* Search Bar */}
          <div className="relative mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Rechercher une région..." 
              className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-[1/2] bg-surface-container-low rounded-3xl p-8 flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image 
                className="w-full h-full object-contain" 
                alt="Carte du Togo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZGPvVUTiwjhWcNUjxFP4-OsWdfVyNPqc09AkNb8fbYqlZJXfnq3No3WgTm2ZDqAkFCzBoZyZ1oBVUNQvv2VUmNo6nd4kGxtxG_VWmxrRWVchm92gsxjqFJqP7-hxWmI3hVQkIhnFyrihSLfT2NUpjZbFeGEcIGfSafqJvJswYlWjSI6FjUSlOBxvjkDJGJ-HJ9_NhHXWFmHbrlP5AVSMR2dAFN6hu996W0YR4M7hz-TPwGQzGo6FQqxXdlfU1olK_NuMtgVW_XQ" 
                fill
                sizes="100vw"
              />
              <div className="absolute top-[10%] left-[50%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[30%] left-[45%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[50%] left-[55%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[70%] left-[48%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[90%] left-[52%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">

      {/* Region Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRegions.map((region) => (
          <div key={region.id} className="group relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col h-full shadow-sm hover:shadow-organic transition-all duration-300">
            <div className="h-48 overflow-hidden relative bg-surface-container flex items-center justify-center">
              {region.img_url ? (
                <Image 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={region.name} 
                  src={region.img_url} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <span className="material-symbols-outlined text-outline text-6xl">{region.icon}</span>
              )}
              <div className="absolute bottom-0 left-0 right-0 glass-card p-4 mx-4 mb-4 rounded-xl">
                <h3 className="font-headline-sm text-headline-sm text-primary">{region.name}</h3>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Total Distribué</p>
                  <p className="font-display-lg text-headline-md text-secondary">{region.distributed}</p>
                </div>
                <span className="material-symbols-outlined text-primary text-4xl">{region.icon}</span>
              </div>
              <div className="mb-6 bg-surface-container p-4 rounded-xl border-l-4 border-primary">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Dernière activité</p>
                <p className="text-body-md text-on-surface">{region.activity}</p>
              </div>
              {region.quote && (
                <blockquote className="italic text-body-md text-on-surface-variant border-t border-outline-variant/30 pt-4 mt-auto">
                  {region.quote}
                  <cite className="block not-italic font-bold text-primary mt-2">— {region.cite}</cite>
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Global Progress Ticker */}
      <section className="mt-24 p-8 rounded-3xl bg-surface-container-high border border-outline-variant/20 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-full">
              <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Impact National</p>
              <h4 className="font-headline-sm text-headline-sm text-primary">
                {safeRegions.reduce((total, region) => {
                  const num = parseInt(region.distributed);
                  return total + (isNaN(num) ? 0 : num);
                }, 0)}{' '}
                Foyers Équipés
              </h4>
            </div>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-outline-variant"></div>
          <div className="text-center md:text-right">
            <p className="text-body-md text-on-surface-variant mb-2">Vous voulez apporter le changement dans votre village ?</p>
            <a className="text-secondary font-bold hover:underline flex items-center justify-center md:justify-end gap-1" href="#">
              Trouver un distributeur local
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
