import Image from 'next/image';

export default function AdminOrders() {
  const orders = [
    { id: '#842', client: 'Amavi Batchassi', city: 'Lomé', model: 'Himalaya', qty: 5, status: 'En cours', color: 'text-green-600' },
    { id: '#841', client: 'Essivi Kpodar', city: 'Atakpamé', model: 'Asouton', qty: 12, status: 'Livré', color: 'text-primary' },
    { id: '#840', client: 'Michel Sambo', city: 'Kara', model: 'Himalaya', qty: 2, status: 'En attente', color: 'text-on-surface-variant' },
    { id: '#839', client: 'Komi Dogbé', city: 'Tsevié', model: 'Asouton', qty: 50, status: 'Confirmé', color: 'text-secondary' },
  ];

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion Commerciale</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Commandes & Stocks</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Supervisez les ventes en temps réel et gérez la distribution nationale.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-xl text-primary font-button text-button hover:bg-surface-container-highest transition-all shadow-sm active:scale-95">
            <span className="material-symbols-outlined">download</span>
            Exporter (CSV)
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Nouvelle Commande
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Himalaya</h3>
                <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-widest">Modèle Premium</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl"><span className="material-symbols-outlined text-primary">inventory_2</span></div>
            </div>
            <div className="mb-4">
              <span className="text-5xl font-bold text-secondary">1,248</span>
              <span className="text-on-surface-variant font-body-md ml-2">unités</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2">
              <div className="bg-secondary h-2 rounded-full w-[78%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              <span>Capacité: 1,600</span>
              <span>78% en stock</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Asouton</h3>
                <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-widest">Modèle Rural</p>
              </div>
              <div className="bg-error/10 p-3 rounded-2xl"><span className="material-symbols-outlined text-error">warning</span></div>
            </div>
            <div className="mb-4">
              <span className="text-5xl font-bold text-primary">452</span>
              <span className="text-on-surface-variant font-body-md ml-2">unités</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2">
              <div className="bg-error h-2 rounded-full w-[28%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              <span>Capacité: 1,600</span>
              <span className="text-error">Alerte: Stock Bas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-8 border-b border-outline-variant/10">
          <h3 className="font-headline-sm text-headline-sm text-primary">Commandes Récentes</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Client</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Modèle</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase text-center">Quantité</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <p className="font-bold text-on-surface">{order.client}</p>
                  <p className="text-xs text-on-surface-variant">{order.city}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${order.model === 'Himalaya' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {order.model}
                  </span>
                </td>
                <td className="px-6 py-5 text-center font-medium">{order.qty}</td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-2 font-bold text-xs ${order.color}`}>
                    <span className={`w-2 h-2 rounded-full bg-current ${order.status === 'En cours' ? 'animate-pulse' : ''}`}></span>
                    {order.status}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-[10px] font-bold shadow-sm hover:brightness-110 transition-all">
                    WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
