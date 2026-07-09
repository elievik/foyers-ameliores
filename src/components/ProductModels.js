"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const getFullUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${url}`;
};

export default function ProductModels() {
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetch('/api/product-images/')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setProductImages(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching product images:', err);
        setProductImages([]);
      });
  }, []);

  const safeProductImages = Array.isArray(productImages) ? productImages : [];

  const products = [
    {
      name: 'Foyer Himalayen',
      price: 'Gratuit',
      type: 'Bois de Chauffe',
      typeColor: 'bg-primary',
      description: "Conçu pour la cuisine au bois en milieu rural. Robuste, stable et incroyablement économe.",
      features: [
        { icon: 'check_circle', text: 'Utilisation multi-combustible' },
        { icon: 'check_circle', text: 'Zéro émission de fumée visible' }
      ],
      images: safeProductImages.filter(i => i.product_name === 'Foyer Himalayen' && i.img_url),
    },
    {
      name: 'Foyer Asuto',
      price: '3000 CFA',
      type: 'Charbon de Bois',
      typeColor: 'bg-secondary-container text-on-secondary-container',
      description: "Le choix idéal pour les familles urbaines. Optimisation maximale de la combustion pour le charbon de bois.",
      features: [
        { icon: 'check_circle', text: 'Haute résistance thermique' },
        { icon: 'check_circle', text: "Jusqu'à 50% de charbon économisé" }
      ],
      images: safeProductImages.filter(i => i.product_name === 'Foyer Asuto' && i.img_url),
    }
  ];

  return (
    <section className="py-24">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">L'excellence technologique locale</h2>
            <p className="font-body-md text-on-surface-variant">Conçus spécifiquement pour les foyers togolais, nos modèles allient durabilité et performance calorifique optimale.</p>
          </div>
          <Link href="/catalog">
            <button className="flex items-center gap-2 text-primary font-button group">
              Voir tout le catalogue <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.name} className="group relative overflow-hidden rounded-2xl shadow-organic bg-surface border border-outline-variant/30">
              <ProductCarouselHome product={product} />
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">{product.name}</h3>
                    <p className="text-secondary font-label-caps uppercase text-xs font-bold tracking-widest">
                      {product.name === "Foyer Himalayen" ? "Efficacité Premium" : "Champion Urbain"}
                    </p>
                  </div>
                  {product.name === "Foyer Himalayen" && (
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Top Vente</span>
                  )}
                </div>
                <p className="font-body-md text-on-surface-variant mb-6">{product.description}</p>
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-primary font-semibold">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span> {feature.text}
                    </li>
                  ))}
                </ul>
                <Link href="/catalog">
                  <button className="w-full bg-primary text-on-primary py-4 rounded-lg font-button text-button hover:brightness-110 transition-all duration-300 shadow-sm">Détails du Modèle</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCarouselHome({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // If no images, don't render anything (or maybe a placeholder, but user asked to remove default images)
  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-surface-container flex items-center justify-center">
        <span className="material-symbols-outlined text-outline text-6xl">image</span>
      </div>
    );
  }

  return (
    <div className="aspect-[16/10] overflow-hidden relative">
      <div className="flex transition-transform duration-500 h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, idx) => {
          const src = getFullUrl(image.img_url);
          if (!src) return null;
          return (
            <div key={idx} className="min-w-full h-full relative">
              <Image
                alt=""
                src={src}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          );
        })}
      </div>

      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-8' : 'bg-white/70'}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
