'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    type: 'avis',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const reviews = [
    {
      name: 'Aminata Atanlé',
      region: 'Région Centrale',
      type: 'Bénéficiaire',
      rating: 5,
      text: 'Le foyer Himalayen a changé ma vie! Je consomme beaucoup moins de bois, et mes enfants ne toussent plus pendant la cuisson.',
      date: '15 Mai 2026'
    },
    {
      name: 'Kodjo Agbeko',
      region: 'Région des Plateaux',
      type: 'Revendeur',
      rating: 4,
      text: 'Produit de qualité, et le support technique est excellent. Les clients adorent le modèle Asuto.',
      date: '20 Avril 2026'
    },
    {
      name: 'Alice Mensah',
      region: 'Région Maritime',
      type: 'Bénéficiaire',
      rating: 5,
      text: 'Très satisfait du produit et du service. Je recommande à toutes les familles!',
      date: '10 Juin 2026'
    }
  ];

  const regionalOffices = [
    { name: 'Maritime', city: 'LOMÉ', phone: '+228 90 05 05 05', address: 'Zone Industrielle', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB91CwSEJ9KGk31z0xR4sVpY-wzatgeNLqjeqfdQmeq2DD3B1DUYFHIqZd4bGdcZ1tL9bjZ9eDs8pPcOxW00xcgS8fsJhTy7Z9CieBqsCxzsCO79GE9jDeBxpu9zVMN_Vb4kb81kyl7HfzIwJumMdAwKaupzNI44M352euC5xcR5HvgK5uUN6y0fFUbAYMqS-gr6BQCBbT7icZ7a1N6AIKbKezbzBRemGsevzJJqiMAcCUwQnuMU8M-4RM0jGgSEyw5TXgx24A-9g' },
    { name: 'Plateaux', city: 'KPALIMÉ', phone: '+228 90 04 04 04', address: 'Près du Mont Agou', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8STKCvvRrnXQUaNW7qPhOaBLcCFwEHJWuIUjt_iOfYdt0s7Gtr2SGFvoZ-nYnXOP94_l7RBsUtyC1gTY9QRsa0EgDTEmtBVdW6_UM4vxqBoiQjLZz_HMjfsoCyH9QDQz9vpwxOhRheBut8m2QAWMeZJ4Mp9KHKmp0D0puK0G6NXOP58StSyzYqwlw0Dp_LFHDqOzhdJ8jLYAjPUWrgZhxzTQlKMHcEm3LbbaW03kSFPbzRCAsrMFprQ2GL4ROtbQl9pkAJch2XA' },
    { name: 'Centrale', city: 'SOKODÉ', phone: '+228 90 03 03 03', address: 'Route Nationale N1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE4Mbu1wZYXlPIQWgnaeTq3lcJZVaIcn9ZSlfZ9abz_VjQtPd8YZQfgjn2BwzEgO0vXg4j6Tf_IShbhjG-7_PYkwNTIyZgzvXW62FHaOjY-YstehnA-VIuM4KdZaWZWE9Y6oWdfnMQQ5XWDbLYGjFjVd_7QL-CBIARupd_mqYVkb1FpxgjLSpLQIi7BJczA6WJP4y4bUmz4khx03wav9nG8mWyzX82RNVAfER57Sjl2tXNHHOClbTEfLfeFNgvapQItGDXwehMRhw' },
    { name: 'Kara', city: 'KARA CITY', phone: '+228 90 02 02 02', address: 'Avenue de la Kozah', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZ9fmccqRuoFL1V2EPrmVBhgiqQZXjdYEZmPo5wG4738SAVkucBiFLABCAtPs_Ms0c90TqP_ON9-xaBD7t2KSS-55dFSx1RCdPKHbXPEn4t8jNHSO1PjENaAtVXK2YhtHitRC4sE_X8GX3T0DAMR6EiyQhpSBoxaIG2kdD0gBdaXju3k0zk62jTFLxeP0FVCtTx91CJXdKvCsGNBlG8QJszYI7SGlKrGPjuV6r2TPGR3RJJORGJVHoAv935XyQoN2nDW_gZ1VXg' },
    { name: 'Savanes', city: 'DAPAONG', phone: '+228 90 01 01 01', address: 'Quartier Administratif', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2s5ie3VJKTfcaIBRv0aPvUET_uXqI7_g2jGyW1IuID68lQITV2p0YkGa5wcNBl7dii3ALZygJHcvWq1XSLgyAB9xuXbDtQmC4KSu-9aB4oEbiDej7qJwedeoWD81xqv73CQ0ixg-5aia_TPu8XQHC0yf_Qbdfiy_Iywm0Oerykb1tpIHg5iTH10ndWCKu6yW95f5WyBEweTP8OOhfvccseYP2cdssBav8mIgNrlrZIc0ipyT5w7xU1mZiVW9cW6OzAs1bgc4Y4A' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nom: '', email: '', type: 'avis', message: '' });
    }, 3000);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            className="w-full h-full object-cover opacity-10" 
            alt="Paysage Togolais serein" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC67FJiioFkhjnGW8UszcmekRrI87f-vySoMe3zbP4yMNC2PMCXBTgSuZHeKaR0sE9l1pxZCrlFbFD1EPoWOl6QK4hWyQG8xNidN9ngw-Gj7oSgrqo7VPosg77BVTVWW-MWB2m958EAMDsbrYO58eaQrVFI-P4gE6DDxMR5og81cvnLdANie0xIcNP6kPRR9hjmWnj4nn0vDdSqhcDNNtElbh7wcic0PxThaZ6k0a4Xw1MrZRCdsGdIyrxKVmeNa637ZMbSyM19Ow" 
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase tracking-widest">Assistance et Écoute</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Contactez-nous pour une<br/>cuisson plus propre</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">Rejoignez la révolution de la cuisson durable au Togo. Notre équipe est là pour vous accompagner dans votre transition vers une énergie propre.</p>
        </div>
      </section>

      {/* Main Interaction Area */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-12 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Contact Form & Reviews */}
        <div className="lg:col-span-7 space-y-12">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-organic border border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-tertiary mb-8">Envoyez un message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Nom Complet</label>
                  <input className="bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none" placeholder="Ex: Koffi Mensah" type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Email</label>
                  <input className="bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none" placeholder="koffi@example.tg" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Téléphone</label>
                  <input className="bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none" placeholder="+228 00 00 00 00" type="tel"/>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Type de message</label>
                  <select className="bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="avis">Avis sur le produit</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="temoignage">Témoignage</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Message</label>
                <textarea className="bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none" placeholder="Comment pouvons-nous vous aider ?" rows="5" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required ></textarea>
              </div>
              {submitted ? (
                <div className="text-center py-6 bg-secondary/10 rounded-lg">
                  <h3 className="font-headline-sm text-primary mb-2">Merci pour votre message!</h3>
                  <p className="text-body-md text-on-surface-variant">Nous reviendrons vers vous très bientôt.</p>
                </div>
              ) : (
                <button className="w-full bg-primary text-white py-4 rounded-lg font-button shadow-organic hover:bg-primary-container transition-all active:scale-[0.98]" type="submit">
                  Envoyer le Message
                </button>
              )}
            </form>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-8">Voix des Communautés</h2>
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                        {review.name.charAt(0)}{review.name.split(' ')[1]?.charAt(0) || ''}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{review.name}</h4>
                        <p className="text-label-caps text-label-caps text-secondary uppercase tracking-wider">
                          {review.type} • {review.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-secondary items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-2">{review.text}</p>
                  <p className="text-xs text-on-surface-variant">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Contact Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Focus */}
          <div className="bg-secondary text-on-secondary p-8 rounded-xl shadow-organic group cursor-pointer overflow-hidden relative transition-transform hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-4xl">chat</span>
                <span className="bg-white/20 text-[10px] px-2 py-1 rounded-full uppercase font-bold">En Ligne</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-2">Support WhatsApp</h3>
              <p className="text-body-md opacity-90 mb-6">Réponse instantanée pour vos questions urgentes et commandes.</p>
              <a className="inline-flex items-center bg-white text-secondary px-6 py-3 rounded-full font-button group-hover:scale-105 transition-transform" href="https://wa.me/22890000000" target="_blank" rel="noopener noreferrer">
                Discuter maintenant
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </a>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/5">
              <span className="material-symbols-outlined text-[160px]">forum</span>
            </div>
          </div>
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl flex items-center space-x-4 border border-outline-variant/30">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase">Téléphone</p>
                <p className="font-headline-sm text-headline-sm text-tertiary">+228 22 45 00 01</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl flex items-center space-x-4 border border-outline-variant/30">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase">Email</p>
                <p className="font-headline-sm text-headline-sm text-tertiary">contact@foyers-togo.tg</p>
              </div>
            </div>
          </div>
          {/* FAQ Link Card */}
          <div className="bg-surface-bright border-2 border-dashed border-outline-variant p-8 rounded-xl text-center">
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Des questions fréquentes ?</h4>
            <p className="text-body-md text-on-surface-variant mb-6">Consultez notre base de connaissances pour des réponses immédiates sur l'utilisation et l'entretien.</p>
            <a className="text-secondary font-button flex items-center justify-center group hover:underline" href="#">
              Voir la FAQ
              <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">chevron_right</span>
            </a>
          </div>
        </div>
      </section>

      {/* Regional Support Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary mb-4">Présence Régionale</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">Trouvez le point de contact le plus proche de chez vous parmi nos 5 bureaux régionaux.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {regionalOffices.map((office) => (
              <div key={office.name} className="glass-card p-6 rounded-xl shadow-organic flex flex-col items-center text-center group hover:-translate-y-2 transition-transform border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-primary relative">
                  <Image 
                    className="w-full h-full object-cover" 
                    alt={office.name} 
                    src={office.img} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary mb-2">{office.name}</h3>
                <p className="text-label-caps font-label-caps text-secondary mb-4 uppercase">{office.city}</p>
                <div className="space-y-2 text-body-md text-on-surface-variant">
                  <p className="flex items-center justify-center"><span className="material-symbols-outlined text-sm mr-1">call</span> {office.phone}</p>
                  <p className="text-sm">{office.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap justify-around gap-8 text-center">
          {[
            { label: 'Temps de réponse moyen', value: '15min' },
            { label: 'Support WhatsApp', value: '24/7' },
            { label: 'Couverture Nationale', value: '100%' }
          ].map((stat) => (
            <div key={stat.label}>
              <span className="font-display-lg text-display-lg text-secondary block">{stat.value}</span>
              <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
