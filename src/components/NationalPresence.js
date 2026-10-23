'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

const DEFAULT_TOGO_REGIONS = [
  {
    id: 'def-maritime',
    name: 'Maritime',
    distributed: '18500',
    icon: 'waves',
    img_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    activity: 'Déploiement à Lomé et dans les préfectures côtières'
  },
  {
    id: 'def-plateaux',
    name: 'Plateaux',
    distributed: '14200',
    icon: 'cloud',
    img_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    activity: 'Sensibilisation des ménages et coopératives agricoles'
  },
  {
    id: 'def-centrale',
    name: 'Centrale',
    distributed: '9800',
    icon: 'agriculture',
    img_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    activity: 'Distribution active à Sokodé et zones rurales'
  },
  {
    id: 'def-kara',
    name: 'Kara',
    distributed: '11300',
    icon: 'forest',
    img_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    activity: 'Préservation des zones montagneuses et boisées'
  },
  {
    id: 'def-savanes',
    name: 'Savanes',
    distributed: '12600',
    icon: 'eco',
    img_url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    activity: 'Protection contre la désertification et économie de bois'
  }
];

export default function NationalPresence({ initialRegions = [] }) {
  const [regions, setRegions] = useState(() => {
    if (Array.isArray(initialRegions) && initialRegions.length > 0) {
      return initialRegions;
    }
    return DEFAULT_TOGO_REGIONS;
  });

  useEffect(() => {
    // Client-side fetch to guarantee fresh data without 1h server cache
    fetch(`${BACKEND_URL}/api/regions/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const visible = data.filter((r) => !r.is_hidden);
          if (visible.length > 0) {
            // Enhanced with default images/icons if missing
            const enhanced = visible.map((reg) => {
              const defaultMatch = DEFAULT_TOGO_REGIONS.find(
                (d) => d.name.toLowerCase() === (reg.name || '').toLowerCase()
              );
              return {
                ...reg,
                img_url: reg.img_url || defaultMatch?.img_url || '',
                icon: reg.icon || defaultMatch?.icon || 'public'
              };
            });

            // Ensure all 5 Togo regions remain present if not all were added yet
            const existingNames = new Set(enhanced.map((r) => (r.name || '').toLowerCase()));
            const remainingDefaults = DEFAULT_TOGO_REGIONS.filter(
              (d) => !existingNames.has(d.name.toLowerCase())
            );

            setRegions([...enhanced, ...remainingDefaults]);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not refresh regions live, keeping current state:', err);
      });
  }, []);

  const displayRegions = regions.length > 0 ? regions : DEFAULT_TOGO_REGIONS;

  return (
    <section className="py-24 bg-tertiary text-on-tertiary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[400px] absolute -right-20 -top-20">public</span>
      </div>
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2 font-bold">
              Couverture Nationale
            </span>
            <h2 className="font-headline-md text-headline-md text-tertiary-fixed">Présence Nationale</h2>
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-label-caps text-xs uppercase tracking-wider mt-4 md:mt-0 transition-colors group"
          >
            <span>Explorer toutes les régions</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className={`grid gap-5 ${
          displayRegions.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          displayRegions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          displayRegions.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          displayRegions.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
        }`}>
          {displayRegions.map((region) => {
            const distributedNum = Number(region.distributed);
            const countLabel = !isNaN(distributedNum) && distributedNum > 0
              ? `${distributedNum.toLocaleString('fr-FR')} Foyers`
              : 'Déploiement actif';

            return (
              <Link
                key={region.id || region.name}
                href="/regions"
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer block border border-white/10 hover:border-white/30 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5"
              >
                {region.img_url ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={region.name}
                    src={region.img_url}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 to-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/30 text-7xl">{region.icon || 'public'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                  <span className="material-symbols-outlined text-lg">{region.icon || 'location_on'}</span>
                </div>

                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h4 className="font-headline-sm text-white mb-1.5 group-hover:text-secondary-fixed transition-colors">
                    {region.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-white/80 font-label-caps">
                    <span className="font-semibold">{countLabel}</span>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      chevron_right
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
