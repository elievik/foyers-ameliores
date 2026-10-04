'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminAgents() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'agent',
    region: 'Maritime',
    prenom: '',
    nom: ''
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchAgents();
  }, [router]);

  async function fetchAgents() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/users`);
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        // Update
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        
        const res = await fetch(`${BACKEND_URL}/api/auth/users/${editingAgent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast('Agent mis à jour');
        } else {
          showToast('Erreur de mise à jour', 'error');
        }
      } else {
        // Create
        if (!formData.password) {
          showToast('Mot de passe requis', 'error');
          return;
        }
        const res = await fetch(`${BACKEND_URL}/api/auth/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          showToast('Agent ajouté');
        } else {
          const err = await res.json();
          showToast(err.detail || 'Erreur', 'error');
        }
      }
      setShowForm(false);
      setEditingAgent(null);
      setFormData({ email: '', password: '', role: 'agent', region: 'Maritime', prenom: '', nom: '' });
      fetchAgents();
    } catch (err) {
      console.error(err);
      showToast('Erreur serveur', 'error');
    }
  };

  const toggleStatus = async (agent) => {
    if (!confirm(`Voulez-vous ${agent.is_active ? 'désactiver' : 'activer'} cet agent ?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/users/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: agent.is_active ? 0 : 1 })
      });
      if (res.ok) {
        fetchAgents();
        showToast('Statut mis à jour');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAgent = async (id) => {
    if (!confirm('Supprimer définitivement cet agent ?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAgents();
        showToast('Agent supprimé');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-button text-sm transition-all ${
          toast.type === 'error' ? 'bg-error' : 'bg-green-600'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Administration</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Gestion des Agents</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Gérez les accès, ajoutez de nouveaux agents ou désactivez des comptes existants.
          </p>
        </div>
        <button onClick={() => {
          setEditingAgent(null);
          setFormData({ email: '', password: '', role: 'agent', region: 'Maritime', prenom: '', nom: '' });
          setShowForm(true);
        }} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button hover:brightness-110 transition-all shadow-lg active:scale-95">
          <span className="material-symbols-outlined">person_add</span>
          Nouvel Agent
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Identité</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Contact</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Région/Rôle</th>
              <th className="px-6 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase">Statut</th>
              <th className="px-8 py-5 font-label-caps text-[10px] text-on-surface-variant uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {agent.prenom?.[0] || agent.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{agent.prenom} {agent.nom}</p>
                      <p className="text-xs text-on-surface-variant">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-on-surface">{agent.email}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {agent.role === 'admin' ? (
                      <span className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-md font-black uppercase">ADMIN</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-black uppercase">AGENT</span>
                    )}
                    {agent.region && <span className="text-xs text-on-surface-variant uppercase font-bold">{agent.region}</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {agent.is_active ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Actif</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Inactif</span>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleStatus(agent)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title={agent.is_active ? 'Désactiver' : 'Activer'}>
                      <span className="material-symbols-outlined text-lg">{agent.is_active ? 'block' : 'check_circle'}</span>
                    </button>
                    <button onClick={() => {
                      setEditingAgent(agent);
                      setFormData({
                        email: agent.email,
                        password: '', // blank intentionally
                        role: agent.role,
                        region: agent.region || 'Maritime',
                        prenom: agent.prenom || '',
                        nom: agent.nom || ''
                      });
                      setShowForm(true);
                    }} className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors" title="Modifier">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    {agent.role !== 'admin' && (
                      <button onClick={() => deleteAgent(agent.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">
                {editingAgent ? 'Modifier un Agent' : 'Ajouter un Agent'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Prénom</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} placeholder="Prénom" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Nom</label>
                  <input required className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} placeholder="Nom" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Email</label>
                <input required type="email" className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="agent@gmail.com" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Mot de passe {editingAgent && '(Laisser vide pour ne pas modifier)'}</label>
                <input type="password" required={!editingAgent} className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" minLength="6" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Rôle</label>
                  <select className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="agent">Agent</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                {formData.role === 'agent' && (
                  <div>
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Région</label>
                    <select className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                      <option value="Maritime">Maritime</option>
                      <option value="Plateaux">Plateaux</option>
                      <option value="Centrale">Centrale</option>
                      <option value="Kara">Kara</option>
                      <option value="Savanes">Savanes</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button hover:bg-surface-container-high transition-colors">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all shadow-md active:scale-95">
                  {editingAgent ? 'Enregistrer' : 'Créer l\'Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
