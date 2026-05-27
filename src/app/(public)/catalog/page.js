import Image from 'next/image';

export default function Catalog() {
  const products = [
    {
      name: 'Foyer Himalaya',
      price: '15,000 CFA',
      type: 'Bois de Chauffe',
      typeColor: 'bg-primary',
      description: 'Le choix robuste pour les familles nombreuses. Optimisé pour une combustion lente et complète du bois, réduisant la fumée de 80%.',
      features: [
        { icon: 'eco', text: 'Économise jusqu\'à 60% de bois' },
        { icon: 'health_and_safety', text: 'Réduction drastique des gaz nocifs' },
        { icon: 'savings', text: 'Rentabilisé en moins de 3 mois' }
      ],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlOE1GvrVzky5IRcHpA3wspX782N5f8A94qVjHk55igzf9FIQAZ_AdfAhXHj3F_aAd5hZsJd_qUvVZhURDuu1jX07DUoqOLQEd4Phl5G2ylI9FvyKZ-hBK7cqdWJ-7kiXN7Jx5Oevx07gjf6ZTGI_lvPSrcawKgtusZiMyBZ0TVwCF7J8MmDYLj357oxdkQj5aLbiUETnmieu_8fNcIwSd8IeHfNJPjca95s8bYGxoRhtT6rGIxbWVj1tvtVayklUHZZZ5R15sKQ'
    },
    {
      name: 'Foyer Asouton',
      price: '12,500 CFA',
      type: 'Charbon de Bois',
      typeColor: 'bg-secondary-container text-on-secondary-container',
      description: 'L\'innovation portable pour les citadins. Conçu pour le charbon, il allie légèreté et performance thermique exceptionnelle.',
      features: [
        { icon: 'eco', text: 'Économise 50% de charbon' },
        { icon: 'directions_walk', text: 'Facilement transportable' },
        { icon: 'timer', text: 'Cuisson 2x plus rapide' }
      ],
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyJ8-82WrKvXEb6xSjvuLdBPKEQDOCTsMhzJQZ7WZGKe9vaNk9yd7QnBNCdza60D4JICYb72dC1RyHJeldjGMk9-h1xEGujsxNxigonoSLygwOWVDw5NMj2DK-CsLoGjBxrAQbk_SbYzEYcd-S7yHxlcZAP1lvGGc2QLKZvY8pQc1LJbPHt8tWutuAFxmtqlJdL4DxvTyHid6YJPt8nAHuppz7_sKcQoHW_4Rq1Dj8pjebu2VgFRZXZ2CQ3yi5Mil4udVSenSM1g'
    }
  ];

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
              <div className="h-80 overflow-hidden relative">
                <Image 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={product.name} 
                  src={product.img} 
                  fill
                />
                <div className={`absolute top-4 left-4 ${product.typeColor} px-3 py-1 rounded text-label-caps font-label-caps uppercase`}>{product.type}</div>
              </div>
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
                <button className="mt-auto w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-lg font-button text-button hover:brightness-110 transition-all">
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
                  <th className="p-6 font-headline-sm text-headline-sm">Foyer Himalaya</th>
                  <th className="p-6 font-headline-sm text-headline-sm">Foyer Asouton</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[
                  ['Combustible', 'Bois (Bûches, débris)', 'Charbon de bois'],
                  ['Utilisation idéale', 'Zones rurales / Familles', 'Zones urbaines / Restauration'],
                  ['Efficacité', 'Haute (Économie 60%)', 'Excellente (Économie 50%)'],
                  ['Matériaux', 'Argile réfractaire massive', 'Céramique isolée et Inox'],
                  ['Poids', 'Fixe (Lourd)', 'Portable (Léger)'],
                  ['Prix', '15,000 CFA', '12,500 CFA']
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
    </main>
  );
}
