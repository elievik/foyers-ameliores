'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminResellers() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingReseller, setViewingReseller] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    telephone: '',
    ville: '',
    region: '',
    autre: ''
  });

  // Check login status first
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  // Charger les demandes au démarrage
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/resellers/`);
        if (res.ok) {
          const data = await res.json();
          setRequests(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
        setRequests([]);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/resellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Recharger la liste
        const resFresh = await fetch(`${BACKEND_URL}/api/resellers/`);
        const data = await resFresh.json();
        setRequests(Array.isArray(data) ? data : []);
        if (viewingReseller && viewingReseller.id === id) {
          setViewingReseller(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const safeRequests = Array.isArray(requests) ? requests : [];

  const filteredRequests = safeRequests.filter(r => {
    const term = searchTerm.toLowerCase();
    const fullName = `${r.prenoms || ''} ${r.nom || ''}`.toLowerCase();
    const phone = (r.telephone || '').toLowerCase();
    const location = `${r.ville || ''} ${r.region || ''}`.toLowerCase();
    const notes = (r.autre || '').toLowerCase();
    const matchesSearch = fullName.includes(term) || phone.includes(term) || location.includes(term) || notes.includes(term);
    const matchesStatus = statusFilter === 'Tous' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteRequest = async (id) => {
    if (confirm('Supprimer cette demande ?')) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/resellers/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setRequests(safeRequests.filter(r => r.id !== id));
          if (viewingReseller && viewingReseller.id === id) {
            setViewingReseller(null);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleAddReseller = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/resellers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ nom: '', prenoms: '', telephone: '', ville: '', region: '', autre: '' });
        // Recharger la liste
        const resFresh = await fetch(`${BACKEND_URL}/api/resellers/`);
        const data = await resFresh.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Validé':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Validé</span>;
      case 'Contacté':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Contacté</span>;
      case 'Refusé':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Refusé</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">En attente</span>;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion Revendeurs</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Demandes de Revendeur</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Consultez les informations complètes des revendeurs, gérez les partenariats et validez les candidatures.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button hover:brightness-110 shadow-sm transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Ajouter un Revendeur
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        {/* Barre de recherche et filtres de statut */}
        <div className="p-6 md:p-8 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative grow max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input 
              className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" 
              placeholder="Rechercher par nom, ville, téléphone..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['Tous', 'En attente', 'Contacté', 'Validé', 'Refusé'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {st}
                {st === 'Tous' ? ` (${safeRequests.length})` : ` (${safeRequests.filter(r => r.status === st).length})`}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Revendeur</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Contact</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Ville/Région</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">person_search</span>
                  <p className="font-medium text-sm">Aucune demande de revendeur trouvée</p>
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-on-surface">{request.prenoms} {request.nom}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(request.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <a href={`tel:${request.telephone}`} className="text-primary hover:underline font-medium">
                      {request.telephone}
                    </a>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-on-surface">{request.ville}, {request.region}</p>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      {/* ACTION ŒIL TOUJOURS ACCESSIBLE POUR TOUS LES STATUTS */}
                      <button 
                        onClick={() => setViewingReseller(request)}
                        className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center justify-center"
                        title="Voir toutes les informations du revendeur"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>

                      {(request.status === 'En attente' || request.status === 'Contacté') && (
                        <>
                          {request.status === 'En attente' && (
                            <button onClick={() => handleUpdateStatus(request.id, 'Contacté')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase hover:brightness-110 transition-all" title="Marquer comme contacté">Contacter</button>
                          )}
                          <button onClick={() => handleUpdateStatus(request.id, 'Validé')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase hover:brightness-110 transition-all">Valider</button>
                          <button onClick={() => handleUpdateStatus(request.id, 'Refusé')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase hover:brightness-110 transition-all">Refuser</button>
                        </>
                      )}

                      <button 
                        onClick={() => handleDeleteRequest(request.id)} 
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Supprimer cette demande"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détails Revendeur (Action Œil) */}
      {viewingReseller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-outline-variant/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-8">
              {/* Entête avec statut et bouton fermer */}
              <div className="flex justify-between items-start gap-4 mb-6 pb-4 border-b border-outline-variant/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-[11px] font-bold">
                      Fiche Partenaire Revendeur
                    </span>
                    {getStatusBadge(viewingReseller.status)}
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {viewingReseller.prenoms} {viewingReseller.nom}
                  </h3>
                </div>
                <button 
                  onClick={() => setViewingReseller(null)} 
                  className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary"
                  title="Fermer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Contenu structuré */}
              <div className="space-y-4">
                {/* Bloc Coordonnées & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-primary">phone</span>
                      Téléphone
                    </p>
                    <a 
                      href={`tel:${viewingReseller.telephone}`} 
                      className="font-bold text-primary hover:underline text-base flex items-center gap-1"
                    >
                      {viewingReseller.telephone}
                    </a>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                      Localisation
                    </p>
                    <p className="font-bold text-on-surface text-base">
                      {viewingReseller.ville}
                      <span className="text-xs text-on-surface-variant font-medium ml-1.5 px-2 py-0.5 bg-surface-container rounded-full">
                        {viewingReseller.region || 'Togo'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bloc Date de demande */}
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Date de soumission</p>
                      <p className="text-sm font-medium text-on-surface">
                        {viewingReseller.created_at
                          ? new Date(viewingReseller.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Non renseignée'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bloc Informations complémentaires / Motivation */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">description</span>
                    Informations complémentaires &amp; Motivation
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap bg-white/70 p-4 rounded-xl border border-outline-variant/10">
                    {viewingReseller.autre && viewingReseller.autre.trim() !== ''
                      ? viewingReseller.autre
                      : 'Aucune information supplémentaire fournie lors de l’inscription.'}
                  </p>
                </div>

                {/* Actions directes depuis le modal */}
                <div className="pt-2">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-3">
                    Modifier le statut de la demande
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(viewingReseller.id, 'Contacté')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        viewingReseller.status === 'Contacté'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                      Contacté
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(viewingReseller.id, 'Validé')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        viewingReseller.status === 'Validé'
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Valider
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(viewingReseller.id, 'Refusé')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        viewingReseller.status === 'Refusé'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                      Refuser
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(viewingReseller.id, 'En attente')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                        viewingReseller.status === 'En attente'
                          ? 'bg-yellow-600 text-white shadow-sm'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">schedule</span>
                      En attente
                    </button>
                  </div>
                </div>

                {/* Lien WhatsApp direct & bouton fermer */}
                <div className="pt-3 flex flex-wrap justify-between items-center gap-3 border-t border-outline-variant/10 mt-4">
                  {viewingReseller.telephone ? (
                    <a
                      href={`https://wa.me/${viewingReseller.telephone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      Écrire sur WhatsApp
                    </a>
                  ) : <div />}
                  <button
                    type="button"
                    onClick={() => setViewingReseller(null)}
                    className="px-5 py-2.5 bg-surface-container text-on-surface text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Revendeur */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">Ajouter un Revendeur</h3>
                <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>
              <form onSubmit={handleAddReseller} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Nom</label>
                    <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Prénoms</label>
                    <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Prénoms" value={formData.prenoms} onChange={(e) => setFormData({...formData, prenoms: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Numéro de téléphone</label>
                  <input required type="tel" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="+228 90 00 00 00" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Ville</label>
                    <input required type="text" className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Région</label>
                    <select required className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                      <option value="">Sélectionner</option>
                      <option value="Savanes">Savanes</option>
                      <option value="Kara">Kara</option>
                      <option value="Centrale">Centrale</option>
                      <option value="Plateaux">Plateaux</option>
                      <option value="Maritime">Maritime</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Autre information</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-24" placeholder="Information supplémentaire..." value={formData.autre} onChange={(e) => setFormData({...formData, autre: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-surface-container text-on-surface py-3 rounded-lg font-button hover:bg-surface-container-low transition-all">Annuler</button>
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-button hover:brightness-110 transition-all">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
