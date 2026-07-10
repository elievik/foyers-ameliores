'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/team/`);
      if (res.ok) {
        setTeamMembers(await res.json());
      }
    } catch (e) {
      console.error('Error fetching team', e);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/partners/`);
      if (res.ok) {
        setPartners(await res.json());
      }
    } catch (e) {
      console.error('Error fetching partners', e);
    }
  };

  const fetchHeroImage = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/hero-images/about`);
      if (res.ok) {
        setHeroImage(await res.json());
      }
    } catch (e) {
      console.error('Error fetching hero image:', e);
    }
  };

  useEffect(() => {
    fetchTeam();
    fetchPartners();
    fetchHeroImage();
  }, []);
  return (
    <>
      {/* Hero Narrative Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImage?.image_url ? (
            <Image 
              className="w-full h-full object-cover opacity-15 grayscale" 
              alt={heroImage.alt_text || "Bannière"}
              src={heroImage.image_url}
              fill
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-surface-container"></div>
          )}
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-label-caps font-label-caps text-secondary tracking-widest block mb-4 uppercase">Notre Histoire</span>
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary mb-6 leading-tight">Transformer l'énergie, préserver la vie.</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-xl">
              Depuis plus d'une décennie, Foyers Améliorés Togo s'engage à réduire la déforestation et à améliorer la santé des ménages togolais. Notre parcours est marqué par une innovation constante au service des communautés rurales et urbaines.
            </p>
            <div className="p-6 bg-primary-container rounded-xl text-on-primary-container border-l-4 border-secondary shadow-sm">
              <p className="font-semibold italic">"Notre ambition pour 2026-2032 est claire : équiper 1 million de foyers avec des solutions de cuisson propres, réduisant ainsi les émissions de CO2 de 40% à l'échelle nationale."</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full overflow-hidden border-8 border-surface-container-high shadow-organic relative">
              <Image 
                className="w-full h-full object-cover" 
                alt="Foyer biomasse moderne amélioré" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM5TqhpKd5nM09IUh93g62xZ-f52UyRpg3M7ErfZ9_jcu2wUz5fl-YQl9Vakh0NGRM_AGHX3nBUmZmQ7m0cnlDqCJ4hiK_A1ceSleP9fWreK5se8fWqKdPMsgEIgMat-kwEiGCzmRcebqkG2EQ9BhES1kizeTy8RJSFq3Y6eia4CoGIdzbh1Oznol-1VJcpT7bG0fqK8fG1QgKWDg-Y9FCKrONsGLcTTKzVFS14r7iE11tqq-_KJBjGn2nE4Rj0mzNQy2VLVqAng"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-8 rounded-2xl shadow-organic max-w-[240px]">
              <span className="text-display-lg font-display-lg text-secondary block">10+</span>
              <span className="text-label-caps font-label-caps text-tertiary">Années d'Impact Écologique</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Blocks */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="text-headline-md font-headline-md text-primary mb-4">Valeurs Fondatrices</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Nous construisons le futur de la cuisson durable sur trois piliers indissociables.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-2xl shadow-organic hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">eco</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-4">Durabilité</h3>
              <p className="text-on-surface-variant">Chaque foyer est conçu pour durer, utilisant des matériaux locaux comme l'argile réfractaire pour minimiser l'empreinte carbone dès la production.</p>
            </div>
            <div className="bg-primary text-on-primary p-10 rounded-2xl shadow-organic hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-4xl">lightbulb</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm mb-4">Innovation</h3>
              <p className="text-on-primary-container opacity-90">Nos ingénieurs collaborent avec des experts internationaux pour optimiser le flux thermique, garantissant une économie de bois de 60% par rapport aux méthodes traditionnelles.</p>
            </div>
            <div className="glass-card p-10 rounded-2xl shadow-organic hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-4xl">groups</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-4">Impact Social</h3>
              <p className="text-on-surface-variant">Nous formons des artisans locaux, créant des emplois durables et améliorant directement la santé respiratoire des femmes et des enfants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Roadmap */}
      <section className="py-24 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-label-caps font-label-caps text-secondary tracking-widest block mb-2">PROJECTIONS</span>
              <h2 className="text-headline-md font-headline-md text-primary">Feuille de Route 2026-2032</h2>
            </div>
            <p className="text-on-surface-variant max-w-md">Une trajectoire ambitieuse pour la transition énergétique du Togo.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary-container to-transparent -translate-x-1/2"></div>
            <div className="space-y-24 relative">
              {/* 2026 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-16 md:text-right">
                  <h4 className="text-headline-sm font-headline-sm text-primary mb-2">Expansion Régionale</h4>
                  <p className="text-on-surface-variant">Couverture totale de la région des Savanes et de la Kara avec 15 nouveaux centres de distribution communautaires.</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center z-10 text-white font-bold shadow-organic">26</div>
                <div className="md:w-1/2 md:pl-16">
                  <img className="w-full h-40 object-cover rounded-xl shadow-organic" alt="Marché local à Kara" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5DicUS3H8rC4wfrdmEMJ3hLfU8SLrSDmQ9LgTnpm-K5nBnScSEFxAAaupw4hmyhgSYH_hQU7A_K_6mS7wpNXI4XqV9UEZRpASkwncEewRFabecjlIZsLmhEWuNvtbF7CKO7QDFHuWwyckNVVKrBIf5kUIEDGVAIPgFcF7BrrIoaaEGFBpWMUhfci-JLg9zAdpybfLiJN5W8MobkayaE5A9Jpw579M3VLTZV9IHcdNyUzkwsQKnlnm019aLFggV7O3SD6RR_fnHg" />
                </div>
              </div>
              {/* 2029 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-0">
                <div className="md:w-1/2 md:pl-16">
                  <h4 className="text-headline-sm font-headline-sm text-primary mb-2">Digitalisation et Crédits Carbone</h4>
                  <p className="text-on-surface-variant">Lancement de notre plateforme de monitoring IoT pour certifier les réductions d'émissions et financer de nouveaux foyers.</p>
                </div>
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center z-10 font-bold shadow-organic">29</div>
                <div className="md:w-1/2 md:pr-16">
                  <img className="w-full h-40 object-cover rounded-xl shadow-organic" alt="Ingénieur analysant des données" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9JLtWr3rHxf5MXk5eDgWcHhrOeX7qX-tW2wzosqLovIeJk97rbVnp4m_fHu2q-iyWCPU8upEzZiivoXUnBCk--rSyJuFyaCWGZ4ieIXgAbybU1q330_2g3XKz67vNYx8FH363VpsTnMY1hDJk0kQ_EH1XDZnRyHp9ww3RlP4W2xiL8iGlIa5018NWG93lH8W7PAkTWrT8P0SzD7AkmqDTAisXigCa5G9il-8P1LBHl16tZ-DRIiBmK-1WKvhgdQDD1EDyFj5_A" />
                </div>
              </div>
              {/* 2032 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
                <div className="md:w-1/2 md:pr-16 md:text-right">
                  <h4 className="text-headline-sm font-headline-sm text-primary mb-2">Objectif 1 Million</h4>
                  <p className="text-on-surface-variant">Consécration de notre mission avec le millionième foyer équipé, faisant du Togo un leader ouest-africain de la cuisson propre.</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center z-10 text-white font-bold shadow-organic border-4 border-primary-fixed">32</div>
                <div className="md:w-1/2 md:pl-16">
                  <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary text-5xl">workspace_premium</span>
                    <span className="text-body-lg font-bold text-primary">Leader de la Transition Énergétique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="text-headline-md font-headline-md text-primary mb-4">L'Équipe de Coordination</h2>
            <p className="text-on-surface-variant">Des experts passionnés dévoués à la cause environnementale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="group text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-organic transition-transform group-hover:scale-105 duration-300 flex items-center justify-center bg-surface-container">
                      {member.img_url ? (
                        <img className="w-full h-full object-cover" alt={member.name} src={member.img_url} />
                      ) : (
                        <span className="material-symbols-outlined text-outline text-6xl">{member.icon}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-full shadow-lg">
                      <span className="material-symbols-outlined">{member.icon}</span>
                    </div>
                  </div>
                  <h4 className="text-headline-sm font-headline-sm text-primary">{member.name}</h4>
                  <p className="text-label-caps font-label-caps text-secondary uppercase tracking-wider">{member.role}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-on-surface-variant">
                Chargement de l'équipe...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-surface border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-12 uppercase tracking-[0.2em]">Ils nous font confiance</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-16 object-contain"
                    />
                  ) : (
                    <span className="text-headline-sm font-bold text-outline">{partner.name}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 block">business</span>
                <p className="font-body-lg">Aucun partenaire enregistré pour le moment.</p>
                <p className="text-sm mt-2">Ajoutez des partenaires depuis le back-office pour les afficher ici.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
