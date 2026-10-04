'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

const STATUT_CONFIG = {
  'En attente': { color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
  'Vérifié':    { color: 'bg-green-100 text-green-700',  icon: 'verified' },
  'Annulé':     { color: 'bg-red-100 text-red-700',      icon: 'cancel' },
};

export default function AdminOrders() {
  const router = useRouter();
  const [userRole, setUserRole] = useState('admin');
  const [agentRegion, setAgentRegion] = useState('');
  const [agentName, setAgentName] = useState('');

  const [activeTab, setActiveTab] = useState('all');       // 'all' | 'himalayen' | 'asuto'
  const [filterStatut, setFilterStatut] = useState('all'); // 'all' | 'En attente' | 'Vérifié' | 'Annulé'
  const [searchQuery, setSearchQuery] = useState('');

  const [himalayenList, setHimalayenList] = useState([]);
  const [asutoList, setAsutoList] = useState([]);
  const [toast, setToast] = useState(null);

  const [showHimalayenForm, setShowHimalayenForm] = useState(false);
  const [showAsutoForm, setShowAsutoForm] = useState(false);
  const [himalayenForm, setHimalayenForm] = useState({});
  const [asutoForm, setAsutoForm] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) { router.push('/login'); return; }
    const role = localStorage.getItem('userRole') || 'admin';
    const region = localStorage.getItem('agentRegion') || '';
    const profileStr = localStorage.getItem('adminProfile');
    setUserRole(role);
    setAgentRegion(region);
    if (profileStr) {
      const p = JSON.parse(profileStr);
      setAgentName(`${p.prenom || ''} ${p.nom || ''}`.trim());
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [hRes, aRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/orders/himalayen`),
        fetch(`${BACKEND_URL}/api/orders/asuto`)
      ]);
      if (hRes.ok) setHimalayenList(await hRes.json());
      if (aRes.ok) setAsutoList(await aRes.json());
    } catch (err) {
      console.warn('Backend injoignable:', err.message);
      setHimalayenList([]);
      setAsutoList([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Filtrage ────────────────────────────────────────────────────────────
  const applyFilters = (list, isHimalayen) => {
    let filtered = [...list];
    // Filtrage région pour agent
    if (userRole === 'agent') {
      filtered = isHimalayen
        ? filtered.filter(h => h.region?.toLowerCase() === agentRegion.toLowerCase())
        : filtered.filter(a => a.ville?.toLowerCase() === agentRegion.toLowerCase());
    }
    // Filtre statut
    if (filterStatut !== 'all') {
      filtered = filtered.filter(r => r.statut === filterStatut);
    }
    // Recherche client
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        `${r.nom} ${r.prenoms}`.toLowerCase().includes(q) ||
        r.telephone?.includes(q) ||
        (isHimalayen ? r.ville_commune : r.ville)?.toLowerCase().includes(q) ||
        r.agent_name?.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const fHimalayen = applyFilters(himalayenList, true);
  const fAsuto = applyFilters(asutoList, false);

  // ─── Changer statut ──────────────────────────────────────────────────────
  const changeStatut = async (type, id, newStatut) => {
    if (userRole !== 'admin') return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${type}/${id}/statut`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut })
      });
      if (res.ok) {
        showToast(`Statut mis à jour : ${newStatut}`);
        fetchData();
      }
    } catch (err) {
      showToast('Erreur lors de la mise à jour.', 'error');
    }
  };

  const handleUpdateSerie = async (type, id, currentSerie) => {
    const newSerie = prompt('Saisir ou modifier le numéro de série du foyer :', currentSerie || '');
    if (newSerie !== null && newSerie !== currentSerie) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders/${type}/${id}/statut`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numero_serie: newSerie })
        });
        if (res.ok) {
          showToast('Numéro de série enregistré avec succès');
          fetchData();
        }
      } catch (err) {
        showToast('Erreur lors de la mise à jour du numéro de série.', 'error');
      }
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Supprimer cet enregistrement ?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/orders/${type}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { showToast('Erreur suppression.', 'error'); }
  };

  // ─── Soumission formulaires ──────────────────────────────────────────────
  const handleHimalayenSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...himalayenForm,
      region: userRole === 'agent' ? agentRegion : himalayenForm.region,
      agent_name: agentName || 'Admin',
      date_inscription: himalayenForm.date_inscription || new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/himalayen`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Inscription Himalayen enregistrée !');
        setShowHimalayenForm(false);
        setHimalayenForm({});
        fetchData();
      } else showToast('Erreur lors de l\'enregistrement.', 'error');
    } catch (err) { showToast('Serveur injoignable.', 'error'); }
  };

  const handleAsutoSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...asutoForm,
      ville: userRole === 'agent' ? agentRegion : (asutoForm.ville || agentRegion),
      agent_name: agentName || 'Admin',
      prix_unitaire: 2500,
      date_vente: asutoForm.date_vente || new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/asuto`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Vente Asuto enregistrée !');
        setShowAsutoForm(false);
        setAsutoForm({});
        fetchData();
      } else showToast('Erreur lors de l\'enregistrement.', 'error');
    } catch (err) { showToast('Serveur injoignable.', 'error'); }
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ['Type', 'Client', 'Téléphone', 'Ville/Région', 'Agent', 'Statut', 'N° Série', 'Date'],
      ...fHimalayen.map(h => ['Himalayen', `${h.nom} ${h.prenoms}`, h.telephone, h.ville_commune, h.agent_name || '—', h.statut, h.numero_serie || '—', h.date_inscription]),
      ...fAsuto.map(a => ['Asuto', `${a.nom} ${a.prenoms}`, a.telephone, a.ville, a.agent_name || '—', a.statut, a.numero_serie || '—', a.date_vente])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ventes_foyers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ─── Stats résumé ────────────────────────────────────────────────────────
  const statsH = { total: fHimalayen.length, verifie: fHimalayen.filter(h => h.statut === 'Vérifié').length, attente: fHimalayen.filter(h => h.statut === 'En attente').length };
  const statsA = { total: fAsuto.length, verifie: fAsuto.filter(a => a.statut === 'Vérifié').length, attente: fAsuto.filter(a => a.statut === 'En attente').length, montant: fAsuto.reduce((s, a) => s + (a.quantite || 0) * 2500, 0) };

  // ─── Rendu tableau ───────────────────────────────────────────────────────
  const renderTable = (list, isHimalayen) => {
    const type = isHimalayen ? 'himalayen' : 'asuto';
    if (list.length === 0) return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl block opacity-30 mb-3">inbox</span>
        <p>Aucune vente enregistrée pour ce filtre.</p>
      </div>
    );

    return (
      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Client</th>
              <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Téléphone</th>
              <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">{isHimalayen ? 'Ville/Commune' : 'Ville'}</th>
              {!isHimalayen && <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-center">Qté</th>}
              {userRole === 'admin' && <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Agent</th>}
              <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">N° Série</th>
              <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Date</th>
              <th className="px-4 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
              <th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {list.map((row) => {
              const cfg = STATUT_CONFIG[row.statut] || STATUT_CONFIG['En attente'];
              return (
                <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">{row.nom} {row.prenoms}</p>
                    {isHimalayen && <p className="text-xs text-on-surface-variant">{row.prefecture} • {row.region}</p>}
                  </td>
                  <td className="px-4 py-4 text-sm text-on-surface">{row.telephone}</td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant">{isHimalayen ? row.ville_commune : row.ville}</td>
                  {!isHimalayen && (
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-primary">{row.quantite}</span>
                      <span className="text-xs text-on-surface-variant ml-1">({(row.quantite * 2500).toLocaleString()}f)</span>
                    </td>
                  )}
                  {userRole === 'admin' && (
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-on-surface-variant">{row.agent_name || '—'}</span>
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded-md text-on-surface-variant">
                      {row.numero_serie || 'Non défini'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-on-surface-variant">{row.date_inscription || row.date_vente}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${cfg.color}`}>
                      <span className="material-symbols-outlined text-xs">{cfg.icon}</span>
                      {row.statut || 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                        {/* Bouton WhatsApp */}
                        <a href={`https://wa.me/${row.telephone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-[#25D366] text-white rounded-lg hover:brightness-110 transition-all" title="WhatsApp">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.112 1.527 5.832L.057 23.804l6.062-1.591A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.399l-.37-.219-3.598.944.962-3.519-.24-.384A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                        </a>
                        {/* Bouton N° Série */}
                        <button onClick={() => handleUpdateSerie(type, row.id, row.numero_serie)}
                          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all" title="Ajouter ou Modifier le N° Série">
                          <span className="material-symbols-outlined text-sm">barcode</span>
                        </button>
                        {/* Bouton Vérifier (Admin uniquement) */}
                        {userRole === 'admin' && row.statut !== 'Vérifié' && (
                          <button onClick={() => changeStatut(type, row.id, 'Vérifié')}
                            className="p-2 bg-green-600 text-white rounded-lg hover:brightness-110 transition-all" title="Marquer Vérifié">
                            <span className="material-symbols-outlined text-sm">verified</span>
                          </button>
                        )}
                        {/* Bouton Annuler (Admin uniquement) */}
                        {userRole === 'admin' && row.statut !== 'Annulé' && (
                          <button onClick={() => changeStatut(type, row.id, 'Annulé')}
                            className="p-2 bg-error text-white rounded-lg hover:brightness-110 transition-all" title="Annuler">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                          </button>
                        )}
                        {/* Remettre en attente (Admin uniquement) */}
                        {userRole === 'admin' && row.statut !== 'En attente' && (
                          <button onClick={() => changeStatut(type, row.id, 'En attente')}
                            className="p-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-all" title="Remettre en attente">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                          </button>
                        )}
                        {/* Supprimer (Admin uniquement) */}
                        {userRole === 'admin' && (
                          <button onClick={() => handleDelete(type, row.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-button text-sm ${
          toast.type === 'error' ? 'bg-error' : 'bg-green-600'
        }`}>
          <span className="material-symbols-outlined text-xl">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion Commerciale</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Ventes & Inscriptions</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            {userRole === 'agent'
              ? <><span className="font-bold text-primary">{agentRegion}</span> — Enregistrez vos ventes terrain et suivez leur validation.</>
              : 'Suivi de toutes les ventes enregistrées par les agents. Vérifiez et validez chaque entrée.'
            }
          </p>
        </div>
        <div className="flex gap-3">
          {userRole === 'agent' && agentRegion && (
            <span className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold">
              <span className="material-symbols-outlined text-base">location_on</span>
              {agentRegion}
            </span>
          )}
          {userRole === 'admin' && (
            <button onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 bg-surface-container-high rounded-xl text-primary font-button hover:bg-surface-container-highest transition-all shadow-sm active:scale-95">
              <span className="material-symbols-outlined">download</span>
              Exporter CSV
            </button>
          )}
        </div>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Himalayen */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Foyer Himalayen</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">Inscriptions terrain</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
          </div>
          <div className="flex gap-6 mb-5">
            <div><p className="text-3xl font-bold text-primary">{statsH.total}</p><p className="text-xs text-on-surface-variant">Total</p></div>
            <div><p className="text-3xl font-bold text-green-600">{statsH.verifie}</p><p className="text-xs text-on-surface-variant">Vérifiés</p></div>
            <div><p className="text-3xl font-bold text-yellow-600">{statsH.attente}</p><p className="text-xs text-on-surface-variant">En attente</p></div>
          </div>
          <button onClick={() => setShowHimalayenForm(true)}
            className="w-full bg-primary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Enregistrer une inscription
          </button>
        </div>

        {/* Asuto */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-secondary">Foyer Asuto</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">Ventes directes (2 500f/unité)</p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-secondary">point_of_sale</span>
            </div>
          </div>
          <div className="flex gap-6 mb-5">
            <div><p className="text-3xl font-bold text-secondary">{statsA.total}</p><p className="text-xs text-on-surface-variant">Total</p></div>
            <div><p className="text-3xl font-bold text-green-600">{statsA.verifie}</p><p className="text-xs text-on-surface-variant">Vérifiés</p></div>
            <div><p className="text-2xl font-bold text-secondary">{statsA.montant.toLocaleString()}f</p><p className="text-xs text-on-surface-variant">Chiffre d'affaires</p></div>
          </div>
          <button onClick={() => setShowAsutoForm(true)}
            className="w-full bg-secondary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Enregistrer une vente
          </button>
        </div>
      </div>

      {/* Barre filtres */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Onglets type */}
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
          {[['all','Tout','table_chart'], ['himalayen','Himalayen','inventory_2'], ['asuto','Asuto','point_of_sale']].map(([k, l, ic]) => (
            <button key={k} onClick={() => setActiveTab(k)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === k ? 'bg-white shadow text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}>
              <span className="material-symbols-outlined text-sm">{ic}</span>{l}
            </button>
          ))}
        </div>

        {/* Filtre statut */}
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
          {[['all','Tous'], ['En attente','En attente'], ['Vérifié','Vérifiés'], ['Annulé','Annulés']].map(([k, l]) => (
            <button key={k} onClick={() => setFilterStatut(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatut === k ? 'bg-white shadow text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}>{l}</button>
          ))}
        </div>

        {/* Recherche */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
          <input
            className="bg-transparent outline-none text-sm flex-1 text-on-surface placeholder:text-on-surface-variant"
            placeholder="Rechercher (nom, téléphone, ville, agent…)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tables */}
      {(activeTab === 'all' || activeTab === 'himalayen') && (
        <div className="mb-8">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">inventory_2</span>
            Inscriptions Himalayen
            <span className="text-sm font-normal text-on-surface-variant">({fHimalayen.length} entrées)</span>
          </h3>
          {renderTable(fHimalayen, true)}
        </div>
      )}
      {(activeTab === 'all' || activeTab === 'asuto') && (
        <div className="mb-8">
          <h3 className="font-headline-sm text-headline-sm text-secondary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">point_of_sale</span>
            Ventes Asuto
            <span className="text-sm font-normal text-on-surface-variant">({fAsuto.length} entrées)</span>
          </h3>
          {renderTable(fAsuto, false)}
        </div>
      )}

      {/* ─── Formulaire Himalayen ─────────────────────────────────────────── */}
      {showHimalayenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">Inscription Himalayen</h3>
                <p className="text-xs text-on-surface-variant">Vente / inscription terrain — non issue du site web</p>
              </div>
              <button onClick={() => setShowHimalayenForm(false)} className="p-2 hover:bg-surface-container rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleHimalayenSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Nom</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Nom"
                    onChange={(e) => setHimalayenForm({ ...himalayenForm, nom: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Prénoms</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Prénoms"
                    onChange={(e) => setHimalayenForm({ ...himalayenForm, prenoms: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Sexe</label>
                  <select required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    onChange={(e) => setHimalayenForm({ ...himalayenForm, sexe: e.target.value })}>
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Téléphone</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="+228..."
                    onChange={(e) => setHimalayenForm({ ...himalayenForm, telephone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Ville / Commune</label>
                <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ville"
                  onChange={(e) => setHimalayenForm({ ...himalayenForm, ville_commune: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Adresse / Village</label>
                <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Adresse"
                  onChange={(e) => setHimalayenForm({ ...himalayenForm, adresse_village: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Région</label>
                  {userRole === 'agent' ? (
                    <div className="w-full bg-surface-container rounded-xl p-3 text-sm font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">location_on</span>{agentRegion}
                    </div>
                  ) : (
                    <select required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      onChange={(e) => setHimalayenForm({ ...himalayenForm, region: e.target.value })}>
                      <option value="">Sélectionner</option>
                      {['Savanes','Kara','Centrale','Plateaux','Maritime'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Préfecture</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Préfecture"
                    onChange={(e) => setHimalayenForm({ ...himalayenForm, prefecture: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Numéro de série (Optionnel)</label>
                <input className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="N° de série du foyer"
                  onChange={(e) => setHimalayenForm({ ...himalayenForm, numero_serie: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Date d'inscription</label>
                <input required type="date" defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  onChange={(e) => setHimalayenForm({ ...himalayenForm, date_inscription: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowHimalayenForm(false)}
                  className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Formulaire Asuto ─────────────────────────────────────────────── */}
      {showAsutoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-secondary">Vente Asuto</h3>
                <p className="text-xs text-on-surface-variant">Vente terrain — Prix unitaire : 2 500 FCFA</p>
              </div>
              <button onClick={() => setShowAsutoForm(false)} className="p-2 hover:bg-surface-container rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAsutoSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Nom</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30" placeholder="Nom"
                    onChange={(e) => setAsutoForm({ ...asutoForm, nom: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Prénoms</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30" placeholder="Prénoms"
                    onChange={(e) => setAsutoForm({ ...asutoForm, prenoms: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Sexe</label>
                  <select required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                    onChange={(e) => setAsutoForm({ ...asutoForm, sexe: e.target.value })}>
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Téléphone</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30" placeholder="+228..."
                    onChange={(e) => setAsutoForm({ ...asutoForm, telephone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Ville / Région</label>
                {userRole === 'agent' ? (
                  <div className="w-full bg-surface-container rounded-xl p-3 text-sm font-bold text-secondary flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">location_on</span>{agentRegion}
                  </div>
                ) : (
                  <select required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                    onChange={(e) => setAsutoForm({ ...asutoForm, ville: e.target.value })}>
                    <option value="">Sélectionner</option>
                    {['Savanes','Kara','Centrale','Plateaux','Maritime'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Quantité</label>
                  <input required type="number" min="1" defaultValue="1"
                    className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                    onChange={(e) => setAsutoForm({ ...asutoForm, quantite: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Date de vente</label>
                  <input required type="date" defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                    onChange={(e) => setAsutoForm({ ...asutoForm, date_vente: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Numéro de série (Optionnel)</label>
                <input className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-secondary/30" placeholder="N° de série du foyer"
                  onChange={(e) => setAsutoForm({ ...asutoForm, numero_serie: e.target.value })} />
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
                <p className="text-[10px] font-bold text-secondary uppercase mb-1">Montant total estimé</p>
                <p className="text-3xl font-bold text-secondary">
                  {((parseInt(asutoForm.quantite) || 1) * 2500).toLocaleString()} FCFA
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAsutoForm(false)}
                  className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button">Annuler</button>
                <button type="submit"
                  className="flex-1 bg-secondary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all">Enregistrer la Vente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
