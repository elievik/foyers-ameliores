'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function NationalPresence({ initialRegions = [] }) {
  const [regions, setRegions] = useState(() => {
    return Array.isArray(initialRegions) ? initialRegions.filter((r) => !r.is_hidden) : [];
  });
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Récupère uniquement les régions créées dans le back-office
    fetch(`${BACKEND_URL}/api/regions/`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setRegions(data.filter((r) => !r.is_hidden));
        }
      })
      .catch((err) => {
        console.error('Erreur chargement régions:', err);
      })
      .finally(() => {
        setHasFetched(true);
      });
  }, []);

  // Si aucune région n'a été ajoutée dans le back-office, ne rien afficher (pas de données inventées)
  if (regions.length === 0) {
    return null;
  }

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

        <div className={`grid gap-6 ${
          regions.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          regions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          regions.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          regions.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
        }`}>
          {regions.map((region) => {
            const distributedNum = Number(region.distributed);
            const countLabel = !isNaN(distributedNum) && distributedNum > 0
              ? `${distributedNum.toLocaleString('fr-FR')} Foyers`
              : '0 Foyer';

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
                  <div className="w-full h-full bg-gradient-to-br from-surface-container-high/40 via-tertiary/60 to-tertiary-container/40 flex flex-col items-center justify-center p-6 border border-white/10">
                    <span className="material-symbols-outlined text-white/40 text-7xl mb-3">{region.icon || 'public'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity group-hover:opacity-90"></div>

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
