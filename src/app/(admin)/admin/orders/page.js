'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminOrders() {
  const router = useRouter();
  const [showHimalayenForm, setShowHimalayenForm] = useState(false);
  const [showAsutoForm, setShowAsutoForm] = useState(false);
  const [himalayenForm, setHimalayenForm] = useState({});
  const [asutoForm, setAsutoForm] = useState({});
  const [himalayenList, setHimalayenList] = useState([]);
  const [asutoList, setAsutoList] = useState([]);

  // Check login status first
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  // Charger les données au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [himalayenRes, asutoRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/orders/himalayen`),
          fetch(`${BACKEND_URL}/api/orders/asuto`)
        ]);
        setHimalayenList(await himalayenRes.json());
        setAsutoList(await asutoRes.json());
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };
    fetchData();
  }, []);

  const handleHimalayenSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/himalayen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(himalayenForm),
      });
      if (response.ok) {
        alert('Inscription Himalayen enregistrée avec succès !');
        setShowHimalayenForm(false);
        setHimalayenForm({});
        // Recharger la liste
        const res = await fetch(`${BACKEND_URL}/api/orders/himalayen`);
        setHimalayenList(await res.json());
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAsutoSubmit = async (e) => {
    e.preventDefault();
    try {
      const asutoData = {
        ...asutoForm,
        prix_unitaire: 2500
      };
      const response = await fetch(`${BACKEND_URL}/api/orders/asuto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asutoData),
      });
      if (response.ok) {
        alert('Vente Asuto enregistrée avec succès !');
        setShowAsutoForm(false);
        setAsutoForm({});
        // Recharger la liste
        const res = await fetch(`${BACKEND_URL}/api/orders/asuto`);
        setAsutoList(await res.json());
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleExportOrders = () => {
    // Fusionner les deux listes pour l'export
    const allOrders = [
      ...himalayenList.map(h => ({
        id: `#${h.id}`,
        client: `${h.nom} ${h.prenoms}`,
        phone: h.telephone,
        city: h.ville_commune,
        model: 'Himalayen',
        qty: 1,
        status: 'En cours',
        color: 'text-green-600'
      })),
      ...asutoList.map(a => ({
        id: `#${a.id}`,
        client: `${a.nom} ${a.prenoms}`,
        phone: a.telephone,
        city: a.ville,
        model: 'Asuto',
        qty: a.quantite,
        status: 'En cours',
        color: 'text-primary'
      }))
    ];
    
    const csvContent = `ID,Client,Téléphone,Ville,Modèle,Quantité,Status
${allOrders.map(o => `${o.id},${o.client},${o.phone},${o.city},${o.model},${o.qty},${o.status}`).join('\n')}
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'commandes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const orders = [
    ...himalayenList.map(h => ({
      id: `#${h.id}`,
      client: `${h.nom} ${h.prenoms}`,
      phone: h.telephone,
      city: h.ville_commune,
      model: 'Himalayen',
      qty: 1,
      status: 'En cours',
      color: 'text-green-600'
    })),
    ...asutoList.map(a => ({
      id: `#${a.id}`,
      client: `${a.nom} ${a.prenoms}`,
      phone: a.telephone,
      city: a.ville,
      model: 'Asuto',
      qty: a.quantite,
      status: 'En cours',
      color: 'text-primary'
    }))
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
          <button onClick={handleExportOrders} className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-xl text-primary font-button text-button hover:bg-surface-container-highest transition-all shadow-sm active:scale-95">
            <span className="material-symbols-outlined">download</span>
            Exporter (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Himalayen</h3>
                <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-widest">Modèle Premium (Inscription)</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl"><span className="material-symbols-outlined text-primary">inventory_2</span></div>
            </div>
            <div className="mb-4">
              <span className="text-5xl font-bold text-secondary">{himalayenList.length}</span>
              <span className="text-on-surface-variant font-body-md ml-2">inscriptions</span>
            </div>
            <button onClick={() => setShowHimalayenForm(true)} className="w-full bg-primary text-white py-3 rounded-xl font-button hover:brightness-110">
              Nouvelle Inscription
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Asuto</h3>
                <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-widest">Modèle Urbain (Vente: 2500f)</p>
              </div>
              <div className="bg-secondary/10 p-3 rounded-2xl"><span className="material-symbols-outlined text-secondary">shopping_cart</span></div>
            </div>
            <div className="mb-4">
              <span className="text-5xl font-bold text-primary">{asutoList.length}</span>
              <span className="text-on-surface-variant font-body-md ml-2">ventes</span>
            </div>
            <button onClick={() => setShowAsutoForm(true)} className="w-full bg-secondary text-white py-3 rounded-xl font-button hover:brightness-110">
              Nouvelle Vente
            </button>
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
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Téléphone</th>
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
                  <p className="font-medium text-on-surface">{order.phone}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${order.model === 'Himalayen' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
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
                  <a
                    href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-[10px] font-bold shadow-sm hover:brightness-110 transition-all"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulaire Inscription Himalayen */}
      {showHimalayenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Inscription - Himalayen</h3>
              <button onClick={() => setShowHimalayenForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleHimalayenSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Nom</label>
                  <input 
                    required 
                    name="nom"
                    onChange={(e) => setHimalayenForm({...himalayenForm, nom: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Nom" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Prénoms</label>
                  <input 
                    required 
                    name="prenoms"
                    onChange={(e) => setHimalayenForm({...himalayenForm, prenoms: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Prénoms" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Sexe</label>
                  <select 
                    required 
                    name="sexe"
                    onChange={(e) => setHimalayenForm({...himalayenForm, sexe: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Téléphone</label>
                  <input 
                    required 
                    name="telephone"
                    onChange={(e) => setHimalayenForm({...himalayenForm, telephone: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="+228..." 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Ville/Commune</label>
                <input 
                  required 
                  name="ville_commune"
                  onChange={(e) => setHimalayenForm({...himalayenForm, ville_commune: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ville/Commune" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Adresse du ménage ou village</label>
                <input 
                  required 
                  name="adresse_village"
                  onChange={(e) => setHimalayenForm({...himalayenForm, adresse_village: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Adresse" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Région</label>
                  <select 
                    required 
                    name="region"
                    onChange={(e) => setHimalayenForm({...himalayenForm, region: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Savanes">Savanes</option>
                    <option value="Kara">Kara</option>
                    <option value="Centrale">Centrale</option>
                    <option value="Plateaux">Plateaux</option>
                    <option value="Maritime">Maritime</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Préfecture</label>
                  <input 
                    required 
                    name="prefecture"
                    onChange={(e) => setHimalayenForm({...himalayenForm, prefecture: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Préfecture" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Date d'inscription</label>
                <input 
                  required 
                  type="date" 
                  name="date_inscription"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setHimalayenForm({...himalayenForm, date_inscription: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowHimalayenForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire Vente Asuto */}
      {showAsutoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Vente - Asuto (2500f)</h3>
              <button onClick={() => setShowAsutoForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAsutoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Nom</label>
                  <input 
                    required 
                    name="nom"
                    onChange={(e) => setAsutoForm({...asutoForm, nom: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Nom" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Prénoms</label>
                  <input 
                    required 
                    name="prenoms"
                    onChange={(e) => setAsutoForm({...asutoForm, prenoms: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="Prénoms" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Sexe</label>
                  <select 
                    required 
                    name="sexe"
                    onChange={(e) => setAsutoForm({...asutoForm, sexe: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Téléphone</label>
                  <input 
                    required 
                    name="telephone"
                    onChange={(e) => setAsutoForm({...asutoForm, telephone: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                    placeholder="+228..." 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Ville</label>
                <input 
                  required 
                  name="ville"
                  onChange={(e) => setAsutoForm({...asutoForm, ville: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ville" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Date de vente</label>
                <input 
                  required 
                  type="date" 
                  name="date_vente"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAsutoForm({...asutoForm, date_vente: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">Quantité</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  name="quantite"
                  defaultValue="1"
                  onChange={(e) => setAsutoForm({...asutoForm, quantite: e.target.value})}
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="1" 
                />
              </div>
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                <p className="font-label-caps text-label-caps text-secondary uppercase text-xs mb-1">Total</p>
                <p className="text-3xl font-bold text-secondary">
                  {((parseInt(asutoForm.quantite) || 1) * 2500).toLocaleString()}f
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAsutoForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit" className="flex-1 bg-secondary text-white py-3 rounded-xl font-button hover:brightness-110">Enregistrer la Vente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
