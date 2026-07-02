'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const getFullUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${url}`;
};

export default function Catalog() {
  const [showHimalayenForm, setShowHimalayenForm] = useState(false);
  const [showAsutoForm, setShowAsutoForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [regions, setRegions] = useState([]);
  const [contactInfo, setContactInfo] = useState({ whatsapp_number: '+22890000000' });

  useEffect(() => {
    fetch('/api/product-images/')
      .then(res => res.json())
      .then(data => setProductImages(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching product images:', err);
        setProductImages([]);
      });
      
    fetch('/api/contact/info')
      .then(res => res.json())
      .then(data => {
        if (data && data.whatsapp_number) setContactInfo(data);
      })
      .catch(err => console.error('Error fetching contact info:', err));

    fetch('/api/regions/')
      .then(res => res.json())
      .then(data => setRegions(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching regions:', err);
        setRegions([]);
      });
  }, []);

  const safeProductImages = Array.isArray(productImages) ? productImages : [];
  const safeRegions = Array.isArray(regions) ? regions : [];
  
  const products = [
    {
      name: 'Foyer Himalayen',
      price: 'Gratuit',
      type: 'Bois de Chauffe',
      typeColor: 'bg-primary',
      description: 'Le choix robuste pour les familles nombreuses. Optimisé pour une combustion lente et complète du bois, réduisant la fumée de 80%.',
      features: [
        { icon: 'eco', text: 'Économise jusqu\'à 60% de bois' },
        { icon: 'health_and_safety', text: 'Réduction drastique des gaz nocifs' },
        { icon: 'savings', text: 'Rentabilisé en moins de 3 mois' }
      ],
      images: safeProductImages.filter(i => i.product_name === 'Foyer Himalayen'),
      defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlOE1GvrVzky5IRcHpA3wspX782N5f8A94qVjHk55igzf9FIQAZ_AdfAhXHj3F_aAd5hZsJd_qUvVZhURDuu1jX07DUoqOLQEd4Phl5G2ylI9FvyKZ-hBK7cqdWJ-7kiXN7Jx5Oevx07gjf6ZTGI_lvPSrcawKgtusZiMyBZ0TVwCF7J8MmDYLj357oxdkQj5aLbiUETnmieu_8fNcIwSd8IeHfNJPjca95s8bYGxoRhtT6rGIxbWVj1tvtVayklUHZZZ5R15sKQ'
    },
    {
      name: 'Foyer Asuto',
      price: '2,500 CFA',
      type: 'Charbon de Bois',
      typeColor: 'bg-secondary-container text-on-secondary-container',
      description: 'L\'innovation portable pour les citadins. Conçu pour le charbon, il allie légèreté et performance thermique exceptionnelle.',
      features: [
        { icon: 'eco', text: 'Économise 50% de charbon' },
        { icon: 'directions_walk', text: 'Facilement transportable' },
        { icon: 'timer', text: 'Cuisson 2x plus rapide' }
      ],
      images: safeProductImages.filter(i => i.product_name === 'Foyer Asuto'),
      defaultImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyJ8-82WrKvXEb6xSjvuLdBPKEQDOCTsMhzJQZ7WZGKe9vaNk9yd7QnBNCdza60D4JICYb72dC1RyHJeldjGMk9-h1xEGujsxNxigonoSLygwOWVDw5NMj2DK-CsLoGjBxrAQbk_SbYzEYcd-S7yHxlcZAP1lvGGc2QLKZvY8pQc1LJbPHt8tWutuAFxmtqlJdL4DxvTyHid6YJPt8nAHuppz7_sKcQoHW_4Rq1Dj8pjebu2VgFRZXZ2CQ3yi5Mil4udVSenSM1g'
    }
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitHimalayen = async (e) => {
    e.preventDefault();
    
    try {
      const himalayenData = {
        ...formData,
        date_inscription: formData.date_inscription || new Date().toISOString().split('T')[0]
      };

      // 1. Envoyer les données au backend
      const response = await fetch('/api/orders/himalayen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(himalayenData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      // 2. Créer le message WhatsApp
      const message = `
📝 NOUVELLE INSCRIPTION - FOYER HIMALAYEN 📝

👤 Nom: ${formData.nom || ''}
👤 Prénoms: ${formData.prenoms || ''}
⚤ Sexe: ${formData.sexe || ''}
📞 Téléphone: ${formData.telephone || ''}
🏘️ Ville/Commune: ${formData.ville_commune || ''}
📍 Adresse/Village: ${formData.adresse_village || ''}
🌍 Région: ${formData.region || ''}
📍 Préfecture: ${formData.prefecture || ''}
📅 Date d'inscription: ${formData.date_inscription || new Date().toLocaleDateString('fr-FR')}
    `.trim();

      // 3. Ouvrir WhatsApp et fermer le formulaire
      openWhatsApp(message);
      setShowHimalayenForm(false);
      setFormData({});
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  const submitAsuto = async (e) => {
    e.preventDefault();
    
    try {
      const quantite = parseInt(formData.quantite) || 1;
      const total = quantite * 3000;
      
      const asutoData = {
        ...formData,
        quantite: quantite,
        prix_unitaire: 3000,
        date_vente: formData.date_vente || new Date().toISOString().split('T')[0]
      };

      // 1. Envoyer les données au backend
      const response = await fetch('/api/orders/asuto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asutoData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      // 2. Créer le message WhatsApp
      const message = `
🛒 NOUVELLE COMMANDE - FOYER ASUTO 🛒

👤 Nom: ${formData.nom || ''}
👤 Prénoms: ${formData.prenoms || ''}
⚤ Sexe: ${formData.sexe || ''}
📞 Téléphone: ${formData.telephone || ''}
🏘️ Ville: ${formData.ville || ''}
📅 Date de vente: ${formData.date_vente || new Date().toLocaleDateString('fr-FR')}
🔢 Quantité: ${quantite}
💰 Prix unitaire: 2,500 CFA
💰 Total: ${total.toLocaleString()} CFA
    `.trim();

      // 3. Ouvrir WhatsApp et fermer le formulaire
      openWhatsApp(message);
      setShowAsutoForm(false);
      setFormData({});
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  const openWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    let phone = contactInfo.whatsapp_number || '+22890000000';
    // Remove '+' or spaces for the wa.me link
    phone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main>
      {/* Hero Header */}
      <section className="relative w-full py-24 md:py-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            className="w-full h-full object-cover" 
            alt="Paysage du Togo au lever du soleil" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLy_9RkTQ0rzquZvuoyaLgZrV8jmLv7ZTr5HZPBP5yeZg04JOwuTRaDk6RBbjw2OGUejP5BH3nMi9wljfd9FRtZZsQlnsMsgBUClT-tTmtYwZIjziACR7lohAuGoRCdX7-v9CAca_hnm4A6KKIOwXZ7V7D0WggTGZmNEDn5HfVQ17z6DxpM6R2Y3NwRq0brpx_Q3xoIibtoWs3ciFwK-FEqfLsfAUPLwH8N8aDc3IJxhGndcCnR6Y5in1rmSOe6FOQdHbYFM3GpQ" 
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center md:text-left">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white max-w-2xl mb-6">
            Nos Solutions de Cuisson
          </h1>
          <p className="text-white/90 text-body-lg font-body-lg max-w-xl mb-8">
            Découvrez notre gamme de foyers améliorés conçus pour transformer votre cuisine, protéger votre santé et préserver l'environnement du Togo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-lg font-button text-button text-center hover:scale-105 transition-all" href="#catalog">Explorer le Catalogue</a>
            <a className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-3 rounded-lg font-button text-button text-center hover:bg-white/20 transition-all" href="#comparison">Comparer les Modèles</a>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-surface px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="catalog">
        <div className="flex flex-col items-center mb-16">
          <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-2">Notre Sélection</span>
          <h2 className="text-headline-md font-headline-md text-primary text-center">Foyers Haute Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {products.map((product) => (
            <div key={product.name} className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-organic group transition-all duration-300 hover:-translate-y-2 border border-outline-variant/30">
              <ProductCarousel product={product} />
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-headline-sm font-headline-sm text-primary">{product.name}</h3>
                  <span className="text-headline-sm font-headline-sm text-secondary">{product.price}</span>
                </div>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                  {product.description}
                </p>
                <div className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                      <span className="text-body-md font-body-md">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => product.name.includes('Himalayen') ? setShowHimalayenForm(true) : setShowAsutoForm(true)}
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-lg font-button text-button hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined">chat</span>
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 bg-surface-container-high px-margin-mobile md:px-margin-desktop" id="comparison">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col items-center mb-16">
            <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-2">Guide d'Achat</span>
            <h2 className="text-headline-md font-headline-md text-primary text-center">Quel foyer est fait pour vous ?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl shadow-organic">
            <table className="w-full text-left bg-white border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-6 font-headline-sm text-headline-sm">Caractéristiques</th>
                  <th className="p-6 font-headline-sm text-headline-sm">Foyer Himalayen</th>
                  <th className="p-6 font-headline-sm text-headline-sm">Foyer Asuto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[
                  ['Combustible', 'Bois (Bûches, débris)', 'Charbon de bois'],
                  ['Utilisation idéale', 'Zones rurales / Familles', 'Zones urbaines / Restauration'],
                  ['Efficacité', 'Haute (Économie 60%)', 'Excellente (Économie 50%)'],
                  ['Matériaux', 'Argile réfractaire massive', 'Céramique isolée et Inox'],
                  ['Poids', 'Fixe (Lourd)', 'Portable (Léger)'],
                  ['Prix', 'Gratuit', '3000 CFA']
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-6 font-bold text-primary bg-surface-container-low">{row[0]}</td>
                    <td className={`p-6 ${idx === 5 ? 'font-bold' : ''}`}>{row[1]}</td>
                    <td className={`p-6 ${idx === 5 ? 'font-bold' : ''}`}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Foyers Installés', value: '45k+' },
            { label: 'Moins de Fumée', value: '80%' },
            { label: 'CO2 Économisé / An', value: '2.5t' },
            { label: 'Régions Couvertes', value: '15' }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span className="font-display-lg text-display-lg text-secondary">{stat.value}</span>
              <span className="font-label-caps text-label-caps text-tertiary uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire Himalayen */}
      {showHimalayenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Inscription - Foyer Himalayen</h3>
              <button onClick={() => setShowHimalayenForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={submitHimalayen} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Nom</label>
                  <input 
                    name="nom"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Nom" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Prénoms</label>
                  <input 
                    name="prenoms"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Prénoms" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Sexe</label>
                  <select 
                    name="sexe"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all">
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Téléphone</label>
                  <input 
                    name="telephone"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="+228..." 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Ville/Commune</label>
                <input 
                  name="ville_commune"
                  required
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ville/Commune" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Adresse du ménage ou village</label>
                <input 
                  name="adresse_village"
                  required
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Adresse" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Région</label>
                  <select 
                    name="region"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all">
                    <option value="">Sélectionner</option>
                    {safeRegions.filter(r => r.is_hidden !== 1).map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Préfecture</label>
                  <input 
                    name="prefecture"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Préfecture" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Date d'inscription</label>
                <input 
                  name="date_inscription"
                  required
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowHimalayenForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-button hover:brightness-110 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  Valider et Envoyer sur WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire Asuto */}
      {showAsutoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Commande - Foyer Asuto (3000f)</h3>
              <button onClick={() => setShowAsutoForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={submitAsuto} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Nom</label>
                  <input 
                    name="nom"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Nom" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Prénoms</label>
                  <input 
                    name="prenoms"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Prénoms" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Sexe</label>
                  <select 
                    name="sexe"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all">
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Téléphone</label>
                  <input 
                    name="telephone"
                    required
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="+228..." 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Ville</label>
                <input 
                  name="ville"
                  required
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ville" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Date de vente</label>
                <input 
                  name="date_vente"
                  required
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Quantité</label>
                <input 
                  name="quantite"
                  required
                  type="number" 
                  min="1" 
                  defaultValue="1"
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="1" 
                />
              </div>
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                <p className="font-label-caps text-label-caps text-secondary uppercase text-xs mb-1">Total à payer</p>
                <p className="text-3xl font-bold text-secondary">
                  {(parseInt(formData.quantite) || 1) * 3000} CFA
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAsutoForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-button hover:brightness-110 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  Valider et Envoyer sur WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


function ProductCarousel({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [{ img_url: product.defaultImg }];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="h-80 relative overflow-hidden">
      <div className="flex transition-transform duration-500 h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, idx) => (
        <div key={idx} className="min-w-full h-full relative">
          <img 
            alt="" 
            src={getFullUrl(image.img_url)} 
            className="w-full h-full object-cover" 
          />
        </div>
      ))}
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

      <div className={`absolute top-4 left-4 ${product.typeColor} px-3 py-1 rounded text-label-caps font-label-caps uppercase`}>{product.type}</div>
    </div>
  );
}
