import Link from 'next/link';
import Image from 'next/image';
import ResellerModal from '@/components/ResellerModal';
import HeroBanner from '@/components/HeroBanner';
import ProductModels from '@/components/ProductModels';
import NationalPresence from '@/components/NationalPresence';

// The backend URL used server-side must always be absolute.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://foyers-ameliores.onrender.com';

const DEFAULT_TESTIMONIALS = [
  {
    id: 'def-1',
    name: 'Akossiwa D.',
    location: 'Région des Plateaux (Kpalimé)',
    text: "Depuis que nous utilisons le foyer amélioré, la consommation de bois a diminué de moitié et il n'y a plus de fumée toxique dans notre cour. Toute la famille cuisine désormais en toute sérénité.",
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'def-2',
    name: 'Kodjo T.',
    location: 'Région de la Kara',
    text: "La rapidité de cuisson avec le foyer Asuto est remarquable. C'est un équipement robuste qui fait faire des économies quotidiennes impressionnantes à notre activité de restauration.",
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

async function getRegions() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/regions/`, {
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const [regions, apiTestimonials] = await Promise.all([
    getRegions(),
    getTestimonials(),
  ]);

  const testimonials = (Array.isArray(apiTestimonials) && apiTestimonials.length > 0)
    ? apiTestimonials
    : DEFAULT_TESTIMONIALS;

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

      {/* Regions Section — Présence Nationale dynamique */}
      <NationalPresence initialRegions={regions} />

      {/* Testimonials */}
      <section className="py-24 bg-surface-bright">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary text-center mb-16 italic">
            {testimonials.length > 0 && testimonials[0].text
              ? `"${testimonials[0].text.substring(0, 70)}..."`
              : "L'impact direct dans le quotidien des familles togolaises"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-10 rounded-3xl border border-outline-variant shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden relative border border-primary/20 shadow-sm flex-shrink-0">
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
                    <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">{testimonial.location || 'Togo'}</p>
                  </div>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
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
