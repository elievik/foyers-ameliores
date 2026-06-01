'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Regions() {
  const [searchQuery, setSearchQuery] = useState('');

  const regions = [
    {
      name: 'Maritime',
      distributed: '0',
      icon: 'waves',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB28wVsxx6mWBwMfY8U3XmwaDWTaVHY7bM5pBKcncS3wh-IER_8fbxlnaRmKa4drB_4dmwo1HLS_vRMraIG8InmVgTaahPBcPh5g59_19cONAvenYkkb9D4Yrdw8uYV7FioGOnauEqTe29evnMNfadeuaRoVmRVcYhWcS3LGq9-QsZn6gpkmf9WxLWUzSgSIa16IOa7GZshgqf_6Z0o9Bqc2UCFvBJsx0qbPb-yVxUv7Toi5qx1vYS6-XDAxJ7VlnF0dTIcoZaFw'
    },
    {
      name: 'Plateaux',
      distributed: '0',
      icon: 'cloud',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5b4oMntUf_TQsSbrquIzskF0cx6QwrXDizvzCvGHftuU8HtumnAhYcOZx7101RIZqth3-fmP6pD3FXxSiTqVUArogYQnPyRzpvPF2nYAgfwLKat5gFSKlxTDZqSkhdIspNme_dIEX06w4NbImdpGk63wrCtZAuj0CnVG24DZ1mGScCSA9-GV2tBQshNJgVESVq6JN8tz87h0Tae_G59BjsvQ-sW11wpxCyY572aofeASeBOQZ7k-I-yX5zq3kxtPO5wrOFdFYeA'
    },
    {
      name: 'Centrale',
      distributed: '0',
      icon: 'agriculture',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkc0bdlxHBCdF8n2PxfO3_EE3afy7WNf-JC11QcmpTkD3dx41zWgCtqTeUO4XdN5zXgKrh_iSFwodvdt5JuaIb71nrGFnCxh8uoWf2Grtr07fbCku8zJEZJBXDDjUCl2i8b7UpcX9STKzKIRA2XCviunPNjuG1Zk4cHWrZ6ByccipSXFNSEN1mQ8n7eKD4jnf_XKeUixu7U8vACkLoRpFHDmzFJm45YHz91MSPrIF7EYMq-UEWnBYgBQAWkdEkR46ubhz5phm1cA'
    },
    {
      name: 'Kara',
      distributed: '0',
      icon: 'forest',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlaunG8xkV4zWuNyZhubthwdyNJbYMh8DCtQuTsqTTuHi0II4P4goOumdtyrFsjtPObKL33k_pvTSbPBJNmowr3SaY_ItXGE1qT2lmSexrnRiJcnxKarHQ058DXBa_qXJlXH1wvu6MUMGO-4943n8YZdMDa8z18PWXma5tVLS4D_h-5rxIzNYTjbnAc3t25DZgODm6vXD9ltUneagSFO-VIE3CBFdICTAbjpsjRBDHP-ewVkaFL76NOQJKrw9AUDCnImPJlvmR_g'
    },
    {
      name: 'Savanes',
      distributed: '0',
      icon: 'eco',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJU9ex3s_0SIeZXsaYTBweWicmDfNBJIcAiJoCbt2LUccauC0OYDk_vtwWvHQDEXVAZu2btoDTYjHgAmMWM_Enf8BTOH-hIHLpN5FHrV0zXcst9s4PgOZgqHYi5xZCjMifJ9XjT_uVxoPKPa2V1kRi5TG38TTmcK7Sq2WuZz2NbKENMDSbfK7A99ibWW_inYT4O86pnNuD8_q1IZuh6GoKBCkhHc3vfJqsjb3aPvMcPErJh9PI2pWchGu6jC7OfIvz4y1PyrK4jA'
    }
  ];

  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Hero & Map Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
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
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-button text-button shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
              Soumettre un rapport
            </button>
            <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-button text-button hover:bg-primary-container transition-colors">
              Voir les Stats Globales
            </button>
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
              />
              <div className="absolute top-[10%] left-[50%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[30%] left-[45%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[50%] left-[55%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[70%] left-[48%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute top-[90%] left-[52%] w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Region Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRegions.map((region) => (
          <div key={region.name} className="group relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col h-full shadow-sm hover:shadow-organic transition-all duration-300">
            <div className="h-48 overflow-hidden relative">
              <Image 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt={region.name} 
                src={region.img} 
                fill
              />
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
        {/* Agent CTA Card */}
        <div className="relative overflow-hidden rounded-3xl bg-primary text-on-primary p-8 flex flex-col justify-center items-start group shadow-organic">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[120px]">badge</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm mb-4 relative z-10">Portail Agent Local</h3>
          <p className="text-on-primary-container mb-8 relative z-10">Accédez aux outils spécialisés, téléchargez les manuels de formation et soumettez vos rapports d'activité.</p>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-lg font-button text-button shadow-lg hover:brightness-110 active:scale-95 transition-all relative z-10 flex items-center gap-2">
            Tableau de Bord Agent
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
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
              <h4 className="font-headline-sm text-headline-sm text-primary">0 Foyers Équipés</h4>
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
  );
}
