import Link from 'next/link';
import Image from 'next/image';
import ResellerModal from '@/components/ResellerModal';
import HeroBanner from '@/components/HeroBanner';
import ProductModels from '@/components/ProductModels';

// The backend URL used server-side must always be absolute.
// On Vercel, NEXT_PUBLIC_API_URL is set to https://foyers-ameliores.onrender.com
// Locally it falls back to localhost:8000 so the dev server also works.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

// Fetch data server-side — no waterfall, no useEffect delay
// Note: heroImage is intentionally fetched client-side (see HeroBanner.js)
// to avoid Render cold-start failures during Vercel's build/SSR phase.

async function getRegions() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/regions/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter((r) => !r.is_hidden);
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/testimonials/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  // Regions and testimonials are fetched server-side (stable data, not affected by Render cold-start).
  // The hero image is fetched client-side via HeroBanner to always use the /api/ proxy.
  const [regions, testimonials] = await Promise.all([
    getRegions(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* Hero Section — client component to reliably load the banner via the /api/ proxy */}
      <HeroBanner />

      {/* Impact Stats */}
      <section className="py-20 bg-surface-container-low">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-xl bg-surface shadow-organic transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
              <h3 className="font-display-lg text-secondary text-4xl mb-2">45k+</h3>
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">Hectares de Forêt Sauvés</p>
            </div>
            <div className="p-8 rounded-xl bg-surface shadow-organic transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              <h3 className="font-display-lg text-secondary text-4xl mb-2">35%</h3>
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">Économies sur le Combustible</p>
            </div>
            <div className="p-8 rounded-xl bg-surface shadow-organic transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-secondary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              <h3 className="font-display-lg text-secondary text-4xl mb-2">80%</h3>
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">Réduction des Fumées Toxiques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Models */}
      <ProductModels />

      {/* Regions Section */}
      <section className="py-24 bg-tertiary text-on-tertiary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <span className="material-symbols-outlined text-[400px] absolute -right-20 -top-20">public</span>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
          <h2 className="font-headline-md text-headline-md mb-12 text-center text-tertiary-fixed">Présence Nationale</h2>
          {regions.length > 0 ? (
            <div className={`grid gap-4 ${regions.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : regions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' : regions.length === 3 ? 'grid-cols-1 md:grid-cols-3' : regions.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-5'}`}>
              {regions.map((region) => (
                <div key={region.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer">
                  {region.img_url ? (
                    <Image
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={region.name}
                      src={region.img_url}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/40 text-6xl">{region.icon || 'public'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h4 className="font-headline-sm text-white mb-2">{region.name}</h4>
                    <div className="flex justify-between items-center text-xs text-white/80 font-label-caps">
                      <span>{region.distributed ? Number(region.distributed).toLocaleString('fr-FR') : '0'} Foyers</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/60">
              <span className="material-symbols-outlined text-6xl mb-4 block">public</span>
              <p className="font-body-lg">Aucune région enregistrée pour le moment.</p>
              <p className="text-sm mt-2">Ajoutez des régions depuis le back-office pour les afficher ici.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-bright">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary text-center mb-16 italic">
            {testimonials.length > 0
              ? `"${testimonials[0].text.substring(0, 50)}..."`
              : 'Ajoutez des témoignages depuis le back-office.'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="glass-card p-10 rounded-3xl border border-outline-variant shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden relative border border-primary/20 shadow-sm">
                      {testimonial.avatar_url ? (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40">
                          <span className="material-symbols-outlined text-4xl">person</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{testimonial.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 block">rate_review</span>
                <p className="font-body-lg">Aucun témoignage enregistré pour le moment.</p>
                <p className="text-sm mt-2">Ajoutez des témoignages depuis le back-office pour les afficher ici.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="bg-primary rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-8 relative z-10">Rejoignez la révolution verte du Togo</h2>
            <p className="font-body-lg text-on-primary/80 mb-12 max-w-2xl mx-auto relative z-10">Commandez votre foyer amélioré aujourd'hui et bénéficiez de notre programme de subvention nationale.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <Link href="/catalog">
                <button className="bg-secondary text-on-primary px-10 py-5 rounded-xl font-button text-button shadow-organic hover:scale-105 transition-all">Commandez Maintenant</button>
              </Link>
              {/* ResellerModal is the only client component on this page */}
              <ResellerModal />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <Link href="/catalog">
        <button className="fixed bottom-8 right-8 bg-secondary text-on-primary w-16 h-16 rounded-full flex items-center justify-center shadow-organic hover:scale-110 active:scale-95 transition-all z-40">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
        </button>
      </Link>
    </>
  );
}
