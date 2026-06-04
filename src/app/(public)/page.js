'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';


export default function Home() {
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    telephone: '',
    ville: '',
    region: '',
    autre: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials/');
      if (res.ok) {
        setTestimonials(await res.json());
      }
    } catch (e) {
      console.error('Error fetching testimonials:', e);
    }
  };

  const fetchHeroImage = async () => {
    try {
      const res = await fetch('/api/hero-images/home');
      if (res.ok) {
        setHeroImage(await res.json());
      }
    } catch (e) {
      console.error('Error fetching hero image:', e);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchHeroImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/resellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ nom: '', prenoms: '', telephone: '', ville: '', region: '', autre: '' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            className="w-full h-full object-cover" 
            alt="Une famille togolaise souriante cuisinant avec un foyer amélioré dans une cuisine moderne et écologique" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl0KHpcTlVrogx_VOf2OzprIE4DMZhe4wnKssR31xDMUD7c3dYGIgwFpLfjpISUYIYuyh9ebZTQk2extXis8LoV3dDMeMIyNhA-7vPO0ufzIOmS5BsloV-9UEiCthdw4Tb8VuQ44hHOFZnwRd9FeGS92r6q_EUTvDuBBDwvH-al2ZNLR6FbLtoDXCxp_Ce5nWF3fkDqBpksrrXTic4--gnaH9ADZRs8zb6MTgurOZjjIzbragYIoi-ie0VMqvWJxuzF6rBddY96Q"
            fill
            sizes="100vw"
            priority
          />
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
              <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-button text-button shadow-organic hover:brightness-110 transition-all active:scale-95">
                Découvrir nos modèles
              </button>
              <button className="bg-white/10 backdrop-blur-md border-2 border-primary text-primary px-8 py-4 rounded-lg font-button text-button hover:bg-primary/5 transition-all active:scale-95">
                Notre Vision
              </button>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Region Cards */}
            {[
              { name: 'Savanes', foyers: '12,000', sat: '98%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa251jeNkSssmssl3YD6Fsw6ofS50neuKWvZWC0h8sQEdb9AE-byzxhC00icNhul3KSHLitsr1qcnm-hfGqlpfxgN8Y5PbuFQR0nFY-dJi1Dsx5NXHJsMdTexLj6vbIcj5Pb73bNhLHbPZe-VxegAmoks7lm_Ld3cvZXJj45SeiGOUqBfC1DzBa80QHd1FQmvggr3ZZf6oI6MnZKG250gXmPu7JwtA7qneBY1eZs4lBAcBA3DvhaQ5Gk51B9QX5tbLo98wuIPDmQ' },
              { name: 'Kara', foyers: '8,500', sat: '95%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv1wBPQrjtz8EcZv2W258Hw1-9UTZlu39Ii4qR77qaVUz3OUotNCSI-EyHVsNqL95_mDPhSW0IydcBPjaHiQX2wdG4AQ9GgOADr1bCMjNp-HKf3YvdIVb7HVZz5-indX5lTax1yRRiFrsAbtTEZ9ekp2UrYb5B_bgZOdTlxgC4qe3wfe3Tfds-jyoGa-voMRUD50z881AHn_UTqcCLQSZWL7-m8QQKhpcnTfMbYlVNHoRIb71gZlm_dUL6KtX2X2A3ckpjs0WK6g' },
              { name: 'Centrale', foyers: '15,200', sat: '99%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc1a_0xgt73sdfOOWkcyh1x7sTF32FHD79RbOVD2RtW8T1VXo5-8mJFT7GrBMzS8tBUJknN5T4lLHX0eeY9wlY8P65H8DwDYyohGqNauyW34dJanRb0odID2_nqxnVtq6X59Pizyg00rSGyTRQezGXZ0aXPwYB4ly2CzaZ45HbwPuqoXarGWNVaFE8tIao6Fz5BHfh3017joog0X3BA2MDrkgYtW8kmRl-c-dBUyy1P2sdBl8YVhH8ieA1wZNm_ahHZq5YEd_XVA' },
              { name: 'Plateaux', foyers: '22,100', sat: '97%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM0nqMkmGW-ECsEdawUiddP6MnbjeHumZhRAtuI5g914xpEKfO-MMDttrg-YY-bJpSSnbAevBq2uyLoU5yVSjK6mWV5B7Nlk1-e7v_IYIxDx3jtrx680EoOIQYtCEkmbKbTzoaezZZe4Z8gNRAsuYEMOQj8cqQB_yXZkOcizxQLbn-TNBivCFLU5jEYHq48Vm4Z3MsXD1Vke29xoC_MtYI_4FC52NxISNCPy6t4oQdd10BuFWH-Raz7GrX-0d8ZJ_ZAf3QsGs_ow' },
              { name: 'Maritime', foyers: '30,400', sat: '96%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTQ_u9GzayIAHhA4ExzptqU2cWViujmoEsclMTjStpL4G4sYDl5xWRi-KQSt4Q9ZUktZsauX4KWgQmfdichHDGQBpR8isXnqrJqJo4xRnDi65kHRKbkDHiQotYV5rvmX70Dp3U5hofDM3IpctRdH-HYqGWdGJen1w9wXcwg9UzD_6XSKdBJAYwTxZD6knC82JYGcuVasm2dmlwJFIngn6MN_alzi2iDzekuxaHgVK77xsWyGjApq0rBudxCfA62oK0YuE5XqNXBw' }
            ].map((region) => (
              <div key={region.name} className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer">
                <Image 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={region.name} 
                  src={region.img} 
                  fill
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h4 className="font-headline-sm text-white mb-2">{region.name}</h4>
                  <div className="flex justify-between items-center text-xs text-white/80 font-label-caps">
                    <span>{region.foyers} Foyers</span>
                    <span>{region.sat} Satisfaction</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-bright">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary text-center mb-16 italic">{testimonials.length > 0 ? `"${testimonials[0].text.substring(0, 50)}..."` : '"Un changement de vie pour ma famille."'} </h2>
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
                    "{testimonial.text}"
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
                    "Depuis que nous utilisons le modèle Himalayen, je dépense moitié moins en bois. Ma cuisine est propre, et mes enfants ne toussent plus à cause de la fumée."
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
                    "L'Asuto est d'une robustesse incroyable. Nous cuisinons pour toute la famille avec très peu de charbon."
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
              <button onClick={() => setShowResellerModal(true)} className="bg-primary-container text-on-primary px-10 py-5 rounded-xl font-button text-button border border-on-primary/20 hover:bg-on-primary-fixed-variant transition-all">Devenir Revendeur</button>
            </div>

            {/* Reseller Modal */}
            {showResellerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-headline-md text-headline-md text-primary">Devenez Revendeur</h2>
                      <button onClick={() => { setShowResellerModal(false); setSuccess(false); }} className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-3xl">close</span>
                      </button>
                    </div>

                    {success ? (
                      <div className="text-center py-8">
                        <div className="text-green-600 text-6xl mb-4">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <h3 className="font-headline-sm text-primary mb-2">Demande envoyée !</h3>
                        <p className="text-on-surface-variant mb-6">Nous vous recontacterons très prochainement.</p>
                        <button onClick={() => { setShowResellerModal(false); setSuccess(false); }} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-button">
                          Fermer
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Nom</label>
                            <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Votre nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                          </div>
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Prénoms</label>
                            <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Vos prénoms" value={formData.prenoms} onChange={(e) => setFormData({...formData, prenoms: e.target.value})} />
                          </div>
                        </div>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Numéro de téléphone</label>
                          <input required type="tel" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="+228 90 00 00 00" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Ville</label>
                            <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Votre ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} />
                          </div>
                          <div>
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Région</label>
                            <select required className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                              <option value="">Sélectionner</option>
                              <option value="Savanes">Savanes</option>
                              <option value="Kara">Kara</option>
                              <option value="Centrale">Centrale</option>
                              <option value="Plateaux">Plateaux</option>
                              <option value="Maritime">Maritime</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Autre information</label>
                          <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-24" placeholder="Information supplémentaire..." value={formData.autre} onChange={(e) => setFormData({...formData, autre: e.target.value})} />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setShowResellerModal(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-lg font-button hover:bg-surface-container-low transition-all">Annuler</button>
                          <button type="submit" disabled={loading} className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-button hover:brightness-110 transition-all disabled:opacity-50">
                            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
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
