'use client';

export default function AdminDashboard() {
  const handleDownloadReport = () => {
    // Exemple de rapport CSV
    const csvContent = `Région,Action,Date,Status
Savanes,Distribution massive,Aujourd'hui 10:45,Terminé
Plateaux,Réapprovisionnement stock,Aujourd'hui 09:30,En cours
Maritime,Nouvelle commande #842,Hier 17:20,Confirmé
Kara,Maintenance système,Hier 14:00,Terminé
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rapport_global.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Aperçu Général</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Tableau de Bord</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Bienvenue, Koffi. Voici un résumé des activités nationales pour aujourd'hui.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleDownloadReport} className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-xl text-primary font-button text-button hover:bg-surface-container-highest transition-all shadow-sm active:scale-95">
            <span className="material-symbols-outlined">download</span>
            Rapport Global
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
            </div>
            <span className="text-green-600 text-xs font-bold">+12%</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-primary">1,248</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">Commandes ce mois</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-secondary/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-secondary">eco</span>
            </div>
            <span className="text-green-600 text-xs font-bold">+5%</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-secondary">2,850t</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">CO2 Économisé</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-tertiary">groups</span>
            </div>
            <span className="text-on-surface-variant text-xs font-bold">Stable</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-tertiary">45,600</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">Foyers Actifs</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-error/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-error">warning</span>
            </div>
            <span className="text-error text-xs font-bold">Action requise</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-error">12</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">Stocks Critiques</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-primary">Activité Récente</h3>
            <button className="text-primary text-sm font-bold hover:underline">Voir tout</button>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Région</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Action</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Date</th>
                  <th className="px-8 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { region: 'Savanes', action: 'Distribution massive', date: 'Aujourd\'hui, 10:45', status: 'Terminé', statusColor: 'text-green-600' },
                  { region: 'Plateaux', action: 'Réapprovisionnement stock', date: 'Aujourd\'hui, 09:30', status: 'En cours', statusColor: 'text-secondary' },
                  { region: 'Maritime', action: 'Nouvelle commande #842', date: 'Hier, 17:20', status: 'Confirmé', statusColor: 'text-primary' },
                  { region: 'Kara', action: 'Maintenance système', date: 'Hier, 14:00', status: 'Terminé', statusColor: 'text-green-600' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-4 font-bold text-on-surface">{row.region}</td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{row.action}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{row.date}</td>
                    <td className={`px-8 py-4 text-right text-xs font-bold ${row.statusColor}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="bg-primary text-on-primary rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline-sm text-headline-sm mb-4">Objectif 2026</h3>
              <p className="text-sm opacity-80 mb-6">Nous sommes à 68% de notre objectif annuel de distribution.</p>
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-secondary-container h-3 rounded-full w-[68%]"></div>
              </div>
              <p className="text-right text-xs font-bold">680,000 / 1,000,000</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <span className="material-symbols-outlined text-[200px]">trending_up</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Alertes Stock</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-error/5 rounded-xl border border-error/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">inventory_2</span>
                  <span className="text-sm font-bold text-on-surface">Asouton - Kara</span>
                </div>
                <span className="text-xs font-bold text-error">12 restants</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">inventory_2</span>
                  <span className="text-sm font-bold text-on-surface">Himalaya - Savanes</span>
                </div>
                <span className="text-xs font-bold text-secondary">45 restants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
