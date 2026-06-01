'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminResellers() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
        const res = await fetch('http://127.0.0.1:8000/api/resellers');
        if (res.ok) {
          setRequests(await res.json());
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/resellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Recharger la liste
        const resFresh = await fetch('http://127.0.0.1:8000/api/resellers');
        setRequests(await resFresh.json());
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm('Supprimer cette demande ?')) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/resellers/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setRequests(requests.filter(r => r.id !== id));
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleAddReseller = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/resellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ nom: '', prenoms: '', telephone: '', ville: '', region: '', autre: '' });
        // Recharger la liste
        const resFresh = await fetch('http://127.0.0.1:8000/api/resellers');
        setRequests(await resFresh.json());
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Validé':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Validé</span>;
      case 'Refusé':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Refusé</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">En attente</span>;
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion Revendeurs</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Demandes de Revendeur</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les demandes de partenariat et validez les nouveaux revendeurs.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button hover:brightness-110 transition-all">
          <span className="material-symbols-outlined">add</span>
          Ajouter un Revendeur
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-8 border-b border-outline-variant/10">
          <h3 className="font-headline-sm text-headline-sm text-primary">Demandes Récentes</h3>
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
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <p className="font-bold text-on-surface">{request.prenoms} {request.nom}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(request.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-on-surface-variant">{request.telephone}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-on-surface">{request.ville}, {request.region}</p>
                </td>
                <td className="px-6 py-5">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-8 py-5 text-right">
                  {request.status === 'En attente' ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleUpdateStatus(request.id, 'Validé')} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase hover:brightness-110 transition-all">Valider</button>
                      <button onClick={() => handleUpdateStatus(request.id, 'Refusé')} className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase hover:brightness-110 transition-all">Refuser</button>
                    </div>
                  ) : (
                    <button onClick={() => handleDeleteRequest(request.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
