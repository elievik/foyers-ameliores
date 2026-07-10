'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total_orders: 0,
    co2_saved: 0,
    himalayen_count: 0,
    asuto_count: 0,
    recent_activity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }

    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur chargement des stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

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
            <span className="text-green-600 text-xs font-bold">+{stats.total_orders > 0 ? 12 : 0}%</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-primary">{stats.total_orders}</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">Commandes ce mois</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-secondary/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-secondary">eco</span>
            </div>
            <span className="text-green-600 text-xs font-bold">+{stats.co2_saved > 0 ? 5 : 0}%</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-secondary">{stats.co2_saved}t</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">CO2 Économisé</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-tertiary">groups</span>
            </div>
            <span className="text-on-surface-variant text-xs font-bold">Stable</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-tertiary">{stats.himalayen_count + stats.asuto_count}</p>
          <p className="text-xs text-on-surface-variant font-label-caps uppercase mt-1">Foyers Actifs</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-error/10 p-3 rounded-xl">
              <span className="material-symbols-outlined text-error">warning</span>
            </div>
            <span className="text-on-surface-variant text-xs font-bold">Aucune alerte</span>
          </div>
          <p className="text-display-lg text-3xl font-bold text-error">0</p>
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
                {stats.recent_activity.length > 0 ? (
                  stats.recent_activity.map((item, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-8 py-4 font-bold text-on-surface">{item.region}</td>
                      <td className="px-6 py-4 text-body-md text-on-surface-variant">{item.action}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{item.date}</td>
                      <td className={`px-8 py-4 text-right text-xs font-bold ${
                        item.status === "Terminé" ? "text-green-600" : 
                        item.status === "Confirmé" ? "text-primary" : "text-secondary"
                      }`}>{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-8 text-center text-on-surface-variant">
                      Aucune activité récente. Créez une inscription ou une vente pour commencer!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="bg-primary text-on-primary rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline-sm text-headline-sm mb-4">Objectif 2026</h3>
              <p className="text-sm opacity-80 mb-6">Nous sommes à {stats.total_orders > 0 ? Math.round((stats.total_orders / 1000000) * 100) : 0}% de notre objectif annuel de distribution.</p>
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-secondary-container h-3 rounded-full w-[{Math.min((stats.total_orders / 1000000) * 100, 100)}%]"></div>
              </div>
              <p className="text-right text-xs font-bold">{stats.total_orders.toLocaleString()} / 1,000,000</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <span className="material-symbols-outlined text-[200px]">trending_up</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Alertes Stock</h3>
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant text-center py-4">Aucune alerte stock pour le moment</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
