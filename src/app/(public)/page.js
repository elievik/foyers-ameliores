import Image from 'next/image';
import Link from 'next/link';
import ResellerModal from '@/components/ResellerModal';

// The backend URL used server-side must always be absolute.
// On Vercel, NEXT_PUBLIC_API_URL is set to https://foyers-ameliores.onrender.com
// Locally it falls back to localhost:8000 so the dev server also works.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

// Fetch data server-side — no waterfall, no useEffect delay
async function getHeroImage() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/hero-images/home`, {
      next: { revalidate: 3600 }, // re-fetch at most every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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
  // All data is fetched in parallel on the server — the page HTML arrives
  // already containing the image URL, so the browser starts loading it immediately.
  const [heroImage, regions, testimonials] = await Promise.all([
    getHeroImage(),
    getRegions(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImage?.image_url ? (
            <Image
              className="w-full h-full object-cover"
              alt={heroImage.alt_text || "Bannière"}
              src={heroImage.image_url}
              fill
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-outline text-8xl">image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-primary-container text-on-primary-container rounded-full text-label-caps font-label-caps mb-6">IMPACT NATIONAL 2026-2032</span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
              Une cuisson propre pour un Togo durable
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
              Protégez votre santé et préservez nos forêts avec les technologies de cuisson améliorées les plus performantes d'Afrique de l'Ouest.
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
            {/* Himalayen Model */}
            <div className="group relative overflow-hidden rounded-2xl shadow-organic bg-surface border border-outline-variant/30">
              <div className="aspect-[16/10] overflow-hidden relative">
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Modèle de foyer Himalayen"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUze5e26joP2hHn4jg02-IKUuQ59kEYoONxyGzvK3OfEkRUcWBt9Wnnyc4t6sUC0EeTdHa2uUuytaSKb-FT0xeVmbcmBE-779WI5IUSmI4zGD-Fjk1_UfsZOH1mVdBy9Wde-r3spaD79GRxl5mXpAQ9drNOHKj3IlyoMbZ3LH22FecQUAYr47jSh3ZLPjOk1mVkA2fVUbRyWmSLnnmLzACFizwrr1-L4vZ6QsUuk47BzTeVR-_otUCvXiz73c02mAFAr5oJPzzgA"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Himalayen</h3>
                    <p className="text-secondary font-label-caps uppercase text-xs font-bold tracking-widest">Efficacité Premium</p>
                  </div>
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Top Vente</span>
                </div>
                <p className="font-body-md text-on-surface-variant mb-6">Conçu pour la cuisine au bois en milieu rural. Robuste, stable et incroyablement économe.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Utilisation multi-combustible
                  </li>
                  <li className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Zéro émission de fumée visible
                  </li>
                </ul>
                <Link href="/catalog">
                  <button className="w-full bg-primary text-on-primary py-4 rounded-lg font-button text-button hover:brightness-110 transition-all duration-300 shadow-sm">Détails du Modèle</button>
                </Link>
              </div>
            </div>
            {/* Asuto Model */}
            <div className="group relative overflow-hidden rounded-2xl shadow-organic bg-surface border border-outline-variant/30">
              <div className="aspect-[16/10] overflow-hidden relative">
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Modèle de foyer Asuto"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbx5WNP5KPSyH1-lkdMIV1yRznbPPyq_ws8ElMXO8pxuG90adfGrSZLKdJXRybIdTd5INylpvZl0HqvnZz1orhsiBwgOWv5gPkN1Ez73CS9edG6cHIozqKmmefF5DLQ4AM6cEu59wrtU7apNcoX1t8e5yBcFR8pmP5N8Ro55zK-DIjKXiwRKCO9h5N6wuayXA55fvRK1fVdQqadD89BTdml_swkaiBCuGtDoGWeTr19Nf9FhueNUgVJh4v3scxkGbIPjBrOfoMDw"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Asuto</h3>
                    <p className="text-secondary font-label-caps uppercase text-xs font-bold tracking-widest">Champion Urbain</p>
                  </div>
                </div>
                <p className="font-body-md text-on-surface-variant mb-6">Le choix idéal pour les familles urbaines. Optimisation maximale de la combustion pour le charbon de bois.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Haute résistance thermique
                  </li>
                  <li className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Jusqu'à 50% de charbon économisé
                  </li>
                </ul>
                <Link href="/catalog">
                  <button className="w-full bg-primary text-on-primary py-4 rounded-lg font-button text-button hover:brightness-110 transition-all duration-300 shadow-sm">Détails du Modèle</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              : '"Un changement de vie pour ma famille."'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="glass-card p-10 rounded-3xl border border-outline-variant shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden relative border border-primary/20 shadow-sm">
                      <img
                        src={testimonial.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARSlszM-dYLNt6m2F8mt77TmwWzZlhUGujfMdcPD_7wF5I1sLPPSqZTZ8wA8paF-_9tmJsrgN8LpByQg5NMWyRnZP3-PDAnHvMWcCb8s-Gdk5Q6kTGHkz71NLYlfgimo2ieu1a9OPuPzIpV0Lmsa9QUnG2dPNj9zEAMWpCFA5i_4TspLQB53BvspYmdxUs4-tOrYIBaZoG-288C0Ng6nOeJaokNGjInnPIYNXslN-kaaM6tvUeHOJQYrTp_1fYK9WTK8G4S13ttw'}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
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
              <>
                <div className="glass-card p-10 rounded-3xl border border-outline-variant shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden relative border border-primary/20 shadow-sm">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuARSlszM-dYLNt6m2F8mt77TmwWzZlhUGujfMdcPD_7wF5I1sLPPSqZTZ8wA8paF-_9tmJsrgN8LpByQg5NMWyRnZP3-PDAnHvMWcCb8s-Gdk5Q6kTGHkz71NLYlfgimo2ieu1a9OPuPzIpV0Lmsa9QUnG2dPNj9zEAMWpCFA5i_4TspLQB53BvspYmdxUs4-tOrYIBaZoG-288C0Ng6nOeJaokNGjInnPIYNXslN-kaaM6tvUeHOJQYrTp_1fYK9WTK8G4S13ttw"
                        alt="Portrait Afiwa K."
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Afiwa K.</p>
                      <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">Kpalimé, Plateaux</p>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    &ldquo;Depuis que nous utilisons le modèle Himalayen, je dépense moitié moins en bois. Ma cuisine est propre, et mes enfants ne toussent plus à cause de la fumée.&rdquo;
                  </p>
                </div>
                <div className="glass-card p-10 rounded-3xl border border-outline-variant shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-secondary-fixed overflow-hidden relative border border-secondary/20 shadow-sm">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYelDnVQzT-8sXqOmz9zRkXqQNXETKeUOkhwL3OJ091ZZ2kTOEYEdaN1mqbc1oJyspfHbh8uFed6TrHjHi1alufngJFpCpohUlDwZmhqR36jYTcjb0o_4oRSnWcVNYVBnVuG62R-nKIpGFzkY5Dkwf3w1IMAPztsEm3MACUKI2kDCqlaAsMMLc7ssEbzShgbAorpPcLhFA9hpc7FBfi9U39P9fC3wkjhVE-A920Mrx_k4hLsVvYVOsfcbK1HWrkl62AaVi0vnHzg"
                        alt="Portrait Koffi M."
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Koffi M.</p>
                      <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">Sokodé, Centrale</p>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    &ldquo;L'Asuto est d'une robustesse incroyable. Nous cuisinons pour toute la famille avec très peu de charbon.&rdquo;
                  </p>
                </div>
              </>
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
