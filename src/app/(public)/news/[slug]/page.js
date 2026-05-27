import Link from 'next/link';
import Image from 'next/image';

export default function ArticleDetail({ params }) {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-caps text-label-caps">
        <Link className="hover:text-primary" href="/">Accueil</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link className="hover:text-primary" href="/news">Actualités</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">Impact Social</span>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <span className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-caps text-label-caps mb-4 uppercase tracking-wider shadow-sm">
          Impact Social
        </span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 max-w-4xl leading-tight">
          L'impact social de la distribution des foyers dans le Nord-Togo
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-body-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary-container overflow-hidden relative shadow-sm">
              <Image 
                alt="Koffi Mensah" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz931FJiUACAUIF69uBgU5NVO5yYKTkinrp774vLzFR6HQ340Fa68-NiEhG75zeB-DtaOHBW7QVGhzq01_BcyzaEXNQGT5Gp8sTkZ3DVSw1qiWn1W0Xlk6ebbmZ2GSwIINwh-rCv6SXd8r8U93IC7TdqD4ERsGUHfH7gU1kuSmsLlTcjP0fUSuLMhsZrAOX8LkdJ7X3zzGCXz0DfpI7oaI-QMw27jB_WmtDiwIMeWP57iz2HK940txbDDj8bIDs7yVbcwLwN0aFA" 
                fill
              />
            </div>
            <div>
              <p className="font-bold text-on-surface">Koffi Mensah</p>
              <p className="text-xs">Agent Régional, Kara</p>
            </div>
          </div>
          <div className="h-4 w-px bg-outline-variant hidden md:block"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>14 Octobre 2023</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>6 min de lecture</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <figure className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden mb-12 shadow-lg relative">
        <Image 
          alt="Bénéficiaire utilisant un foyer" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUoUXOKxAf1KiU00ni5hOfPWk16LDDxp6mO-ARH8f5igq7hO-tUFjoKyTF_hZ9eEcvFw4JFJk8DrNTLgaPDjiI0E6183qFHcEI27trxhO8d4M0Z1PIM77fU4PYLp8B4G0tp-9ctzpQXKXrRfHV7k-9aVR6tZV_frpplqYqZ-G5uJ826coVMgGyf_RF-tw7wszWytLpUKSgbyr_dueiVWnFt2HogHCgweHEx5HbZXLcwsTnKE9Gk1ZWchqLg8XMEhIfsg-9dQQgQ" 
          fill
          priority
        />
      </figure>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-8 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          <p className="text-xl font-medium text-primary mb-8 leading-relaxed italic">
            Dans les régions reculées du Nord-Togo, une révolution silencieuse s'opère au cœur des foyers. Plus qu'une simple amélioration technique, l'introduction des foyers améliorés redéfinit la vie quotidienne des femmes et l'avenir de l'environnement local.
          </p>
          
          <p className="mb-6">Depuis le début de notre programme d'extension en 2022, plus de 5 000 foyers ont été distribués dans les régions de la Kara et des Savanes. Les résultats vont bien au-delà de la simple réduction de la consommation de bois ; c'est un véritable levier de transformation sociale que nous observons sur le terrain.</p>
          
          <h2 className="font-display-lg text-headline-sm text-primary mt-10 mb-4">Une santé préservée au quotidien</h2>
          <p className="mb-6">Traditionnellement, la cuisine est un espace de fumée dense et nocive. "Avant, mes yeux pleuraient chaque matin et mes enfants toussaient sans cesse," nous confie Akossiwa, résidente de Dapaong. Avec nos nouveaux foyers à combustion optimisée, les émissions de particules fines sont réduites de 80%.</p>
          
          <blockquote className="my-12 p-8 border-l-4 border-secondary bg-surface-container-low rounded-r-xl">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <p className="font-display-lg text-headline-sm text-tertiary italic leading-snug">
              "Ce foyer a changé ma vie, je ne respire plus de fumée et je fais des économies chaque jour. Mes enfants peuvent maintenant rester à mes côtés pendant que je cuisine."
            </p>
            <cite className="block mt-4 font-bold text-on-surface not-italic">— Mme Akossiwa B., Bénéficiaire à Dapaong</cite>
          </blockquote>
          
          <h2 className="font-display-lg text-headline-sm text-primary mt-10 mb-4">Économie de temps et d'argent</h2>
          <p className="mb-6">Le gain économique est le second pilier de cette réussite. En réduisant la consommation de bois de 50%, les familles économisent en moyenne 15 000 FCFA par mois, une somme réinjectée dans la scolarité des enfants ou dans de petits commerces locaux.</p>
          <p className="mb-6">De plus, la corvée de bois, autrefois quotidienne et épuisante, est devenue moins fréquente, libérant ainsi des heures précieuses pour les activités génératrices de revenus et le repos.</p>
          
          {/* Sharing Buttons */}
          <div className="mt-12 pt-8 border-t border-outline-variant flex items-center gap-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Partager :</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">chat</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Key Figures */}
          <div className="bg-primary text-on-primary p-8 rounded-2xl shadow-xl space-y-8">
            <h3 className="font-headline-sm text-headline-sm border-b border-primary-fixed-dim pb-4">Chiffres Clés</h3>
            <div className="space-y-6">
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">5,000+</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">FAMILLES IMPACTÉES</p>
              </div>
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">12.5t</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">DE BOIS SAUVÉS / MOIS</p>
              </div>
              <div>
                <p className="font-display-lg text-secondary-container text-4xl leading-none">80%</p>
                <p className="font-label-caps text-label-caps text-primary-fixed mt-2 uppercase">MOINS DE FUMÉE TOXIQUE</p>
              </div>
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-sm">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">À PROPOS DE L'AUTEUR</h3>
            <div className="flex items-start gap-4">
              <img 
                alt="Koffi Mensah" 
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi_SMGiaMrChv_za3jhH-W9mvWC0Q1ZXMUz5GJ141dno2SvkjwTax9QIg4UJQ3nHrzFVmgfdIST6-F5T23PXDLyWDvQT14D308ZXGgpAzwQ3oae8W1tphsOnHifvUlQ3HTGblOaTx-vhX215njMnJ_vE6nkz11PRewb8HablQuQkfh_s0PRGckqkfDWPfYOZUU5WZuwVCMXBBB--3K96CRKKGsE6Frf4kWECEo37aftZ4Zc-sj30eRF-nenwFHxvEw3Tih_6i3BA" 
              />
              <div>
                <p className="font-bold text-primary">Koffi Mensah</p>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Spécialiste en impact environnemental et agent régional pour la zone Nord.</p>
                <a className="text-secondary font-button text-sm flex items-center gap-2 hover:underline" href="mailto:k.mensah@foyers-togo.tg">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Contacter Koffi
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-headline-md text-primary">Articles Connexes</h2>
          <Link className="text-secondary font-button flex items-center gap-2 hover:translate-x-1 transition-transform" href="/news">
            Voir toute l'actualité <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { cat: 'ÉCOLOGIE', title: 'La préservation de la biodiversité dans les Plateaux', img: 'https://picsum.photos/seed/eco1/800/450' },
            { cat: 'INNOVATION', title: 'Nouveaux modèles : L\'efficacité thermique au cœur du design', img: 'https://picsum.photos/seed/inv1/800/450' },
            { cat: 'FORMATION', title: 'Comment former sa communauté à l\'utilisation durable', img: 'https://picsum.photos/seed/edu1/800/450' }
          ].map((item, idx) => (
            <Link key={idx} className="group" href="#">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm">
                <Image alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.img} fill />
              </div>
              <span className="text-secondary font-label-caps text-label-caps uppercase tracking-widest text-[10px] font-bold">{item.cat}</span>
              <h4 className="font-headline-sm text-lg mt-2 group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
