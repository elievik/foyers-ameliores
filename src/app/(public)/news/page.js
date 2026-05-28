'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function News() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email === 'foyer@gmail.com') {
      router.push('/login');
    } else {
      // Logic for regular newsletter signup
      alert('Merci pour votre inscription !');
      setEmail('');
    }
  };
  const newsItems = [
    {
      region: 'Centrale',
      date: '05 OCT 2023',
      category: 'FORMATION',
      title: 'Formation des ambassadeurs de l\'écologie à Sokodé',
      description: 'Plus de 50 jeunes ont participé au programme intensif de formation sur la maintenance des foyers et la sensibilisation au reboisement.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE7enVUBzhRQY9kg2Rv5zWhlDnAJb9tpqLFcUKfR8q8jmDQ5FtBtSihlC8OdAQ3ESfspyeeikIPjKvoWyoH8QNUARdWk92bC8PCk7EG1qfcJf642UXOzEoXuTDHp8Pph_ozn2UmVGiAEFqPYm4h-dxUXv54StYqpvDcVWIGlJLYBvitzbmq0NjXa_EZyEM1L1oQn7-QhB2XFiJaZFoN4oGPmy2UezkSvOgVWo3tnUsI8k1mK065FtzGeYM2nBrX8g7TGisNLC1xw'
    },
    {
      region: 'Plateaux',
      date: '28 SEPT 2023',
      category: 'DISTRIBUTION',
      title: 'Kpalimé : 1000 foyers distribués en une semaine',
      description: 'Le record de distribution a été battu dans la région des Plateaux grâce à notre nouveau système logistique optimisé par le numérique.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0EzkjIGi0C4OaUuX6OjxAcFWkgQPj1iY61l2t5iGRGU-LZusjVnBn2zB8Xx6gkVD7NLCoWZQNrvQFTPYYXSxFgnau4vthwJjsOVBV5jODFGX76Oxtd208cPsbvFtXav9EeL4bXKQJH467x98dS_TdP2t6nXGHUm9nVXFtlG73pR22qOlOx9Yd1uej0ZRgCCTnxt2UbOeT8LHgw967wjDzcr6OGu9yaAVvOPXPuiEEHlBdvH6aPMbcLOhipMnjmmcv7zJe0G4Vsg'
    },
    {
      region: 'Maritime',
      date: '15 SEPT 2023',
      category: 'TÉMOIGNAGES',
      title: 'Une nouvelle vie pour les familles de Baguida',
      description: '"Mes enfants ne toussent plus dans la cuisine." Découvrez le témoignage poignant d\'Amavi, bénéficiaire du programme depuis 6 mois.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADGDSB1kDBKYHinhGG_WamcJ4UbJs4ahxOP13nNmzWsvTK9t5wJoY_T-xL5PcFWmqZfbBCwdZJwBy6q2tnf5ynqOgoxpPfp04e99hh1Hvmw35rUHV6soPz_l2ebt0hbE8a2VlYFEOAX8DLDX6LDnLBkbSgVt9QktaNyvYFZRo628Wnt4qoodNQ5idoQb2WEj64k3utNoEYoh1UYLSR7SmbggOORAGQQihPFKMql9koSmVDyaiuD1_xo6AFbNwyQIkmtWOAjC2PGg'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <Image 
            alt="Paysage Togolais" 
            className="w-full h-full object-cover opacity-20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByTUIj1jRvRXuH4Q9MCMP8Bx35CUXBchnuDrSqqNUZaKAO0fFqXONnjkakNPWWPeo5RZULfzaxHnLbVAG_CLWumr8AEixMrH9-LlId2e2M1EQXSZxOXdr9JX3v01kYa9dsKk8lFSUQEjrm6TrEJNqrYzvexRQJWnQZedJrKHvb8BCe5jNuLPehW6SJWngCH-km0u33RN75zDCR7RYY1OqKX4wm0zPZLjjem_cybmyyHSUlmn0ea5Doy6-yK77Yzb3oAcOl8mOHRw" 
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface"></div>
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">Journal du Changement</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Actualités & Impact sur le Terrain</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Découvrez les histoires inspirantes de transition énergétique à travers les 5 régions du Togo. Du Maritime aux Savanes, nous documentons chaque foyer amélioré et chaque forêt préservée.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto -mt-20 relative z-20">
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic flex flex-col md:flex-row min-h-[400px] border border-outline-variant/30">
          <div className="md:w-1/2 relative overflow-hidden group">
            <Image 
              alt="Article à la Une" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9wpyBanLIBc9UjG8LMNC-1UFsNVxjHYAw7dGu-VCJisgAJJIRcq46HRjAvkrPDzOWW-ildI9xFCXS5RNAfRk8fW7Ve51yevp0m8Ehb3by9kH5WvmE3rkG_k0CW9sWuU8NuZ_ZD69TF7-alGah2hU5Ppxa_1g3TGDZb8necWfaKnw0L3Ax2j9jtdSxF3SIYtv0AiJBH9vPmj1TEqHXGOWjBHis1TZa5QTZOqqMFer8_P6kj7ZWXXQ6S8nRAisgJVPPNFe1MKVNjg" 
              fill
            />
            <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1 rounded-full font-label-caps text-label-caps">
              À LA UNE
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">Région de la Kara</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant font-medium">12 OCTOBRE 2023</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 leading-tight">L'impact social de la distribution des foyers dans le Nord-Togo</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              Comment l'introduction de technologies de cuisson propre transforme radicalement le quotidien des femmes maraîchères de la région de la Kara, réduisant de 60% la consommation de bois de chauffe.
            </p>
            <div>
              <Link href="/news/impact-social-kara" className="inline-flex items-center gap-2 text-primary font-button group transition-all hover:translate-x-1">
                Lire l'article complet
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-outline-variant pb-8">
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-button text-button shadow-sm">Toutes les actus</button>
            {['Savanes', 'Kara', 'Centrale', 'Plateaux', 'Maritime'].map((region) => (
              <button key={region} className="bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full font-button text-button hover:bg-primary-container hover:text-on-primary-container transition-colors">
                {region}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined">filter_list</span>
            <span className="font-label-caps text-label-caps uppercase">Trier par: Récent</span>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {newsItems.map((item, idx) => (
            <div key={idx} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic flex flex-col group h-full border border-outline-variant/30 transition-all hover:-translate-y-1">
              <div className="h-56 overflow-hidden relative">
                <Image alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.img} fill />
                <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full font-label-caps text-[10px] text-primary">{item.category}</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-label-caps text-secondary uppercase">{item.region}</span>
                  <span className="font-label-caps text-label-caps text-outline">{item.date}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-4">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-auto">
                  <Link href={`/news/${idx}`} className="text-primary font-button flex items-center gap-1 hover:gap-2 transition-all">
                    Lire la suite <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <button className="border-2 border-primary text-primary px-10 py-3 rounded-lg font-button hover:bg-primary hover:text-on-primary transition-all">
            Charger plus d'articles
          </button>
        </div>
      </section>

      {/* Rapports d'Impact Section */}
      <section className="bg-surface-container-low py-24 px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">Transparence & Résultats</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Rapports d'Impact et Données de Terrain</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
                Nous croyons en la force des chiffres. Consultez nos rapports annuels détaillant la réduction des émissions de CO2, les hectares de forêts sauvés et l'amélioration de la santé publique au Togo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Rapport Annuel 2023', size: '4.2 MB' },
                  { title: 'Étude d\'Impact Kara', size: '2.8 MB' }
                ].map((report) => (
                  <div key={report.title} className="bg-surface p-6 rounded-lg border border-outline-variant hover:border-primary transition-all group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-4xl">picture_as_pdf</span>
                      <div>
                        <h4 className="font-button text-on-surface">{report.title}</h4>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">PDF • {report.size}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="material-symbols-outlined text-primary group-hover:translate-y-1 transition-transform">download</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Foyers Distribués', value: '45k+', bg: 'bg-primary', textColor: 'text-secondary-fixed-dim' },
                { label: 'CO2 Évité', value: '120t', bg: 'bg-surface-container-highest', textColor: 'text-secondary', mt: 'mt-12' },
                { label: 'Emplois Créés', value: '500+', bg: 'bg-surface-container-highest', textColor: 'text-secondary', mt: '-mt-12' },
                { label: 'Taux d\'Adoption', value: '95%', bg: 'bg-primary-container', textColor: 'text-on-primary-container' }
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.bg} ${stat.textColor} p-8 rounded-2xl text-center flex flex-col items-center justify-center h-48 shadow-organic ${stat.mt || ''}`}>
                  <div className="font-display-lg text-[42px] mb-2">{stat.value}</div>
                  <div className="font-label-caps text-label-caps uppercase tracking-widest opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center border border-outline-variant shadow-organic">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Restez informés de la révolution verte</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            Inscrivez-vous à notre newsletter mensuelle pour recevoir les dernières actualités sur l'écologie au Togo et nos rapports d'impact.
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
          <p className="mt-6 font-label-caps text-[11px] text-outline italic">
            En vous abonnant, vous acceptez notre politique de confidentialité. Désabonnement possible à tout moment.
          </p>
        </div>
      </section>
    </main>
  );
}
