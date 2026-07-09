'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HeroBanner() {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Uses the /api/ proxy rewrite (Vercel → Render), same as all other pages.
    // This guarantees the banner always loads even if Render was sleeping at build time.
    fetch(`${BACKEND_URL}/api/hero-images/home`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setHeroImage(data))
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImage?.image_url ? (
          <Image
            className="w-full h-full object-cover"
            alt={heroImage.alt_text || 'Bannière'}
            src={heroImage.image_url}
            fill
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-surface-container" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1 bg-primary-container text-on-primary-container rounded-full text-label-caps font-label-caps mb-6">
            IMPACT NATIONAL 2026-2032
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Une cuisson propre pour un Togo durable
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
            Protégez votre santé et préservez nos forêts avec les technologies de cuisson améliorées
            les plus performantes d'Afrique de l'Ouest.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalog">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-button text-button shadow-organic hover:brightness-110 transition-all active:scale-95">
                Découvrir nos modèles
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white/10 backdrop-blur-md border-2 border-primary text-primary px-8 py-4 rounded-lg font-button text-button hover:bg-primary/5 transition-all active:scale-95">
                Notre Vision
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
