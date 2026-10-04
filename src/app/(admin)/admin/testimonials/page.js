'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: '',
    avatar_url: '',
    file: null,
    order: 0,
  });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/testimonials/all`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setTestimonials([]);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('location', formData.location);
    fd.append('text', formData.text);
    fd.append('order', formData.order.toString());
    fd.append('status', 'Validé');
    if (formData.file) {
      const compressed = await compressImage(formData.file);
      fd.append('file', compressed);
    }
    if (formData.avatar_url) fd.append('avatar_url', formData.avatar_url);

    const url = editingTestimonial
      ? `${BACKEND_URL}/api/testimonials/${editingTestimonial.id}`
      : `${BACKEND_URL}/api/testimonials/`;
    const method = editingTestimonial ? 'PATCH' : 'POST';

    const res = await fetch(url, { method, body: fd });
    if (res.ok) {
      showToast(editingTestimonial ? 'Témoignage mis à jour' : 'Témoignage ajouté');
    }
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({ name: '', location: '', text: '', avatar_url: '', file: null, order: 0 });
    fetchTestimonials();
  };

  const handleEdit = (t) => {
    setEditingTestimonial(t);
    setFormData({ name: t.name, location: t.location, text: t.text, avatar_url: t.avatar_url || '', file: null, order: t.order });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce témoignage ?')) {
      await fetch(`${BACKEND_URL}/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
      showToast('Témoignage supprimé');
    }
  };

  const handleValidate = async (id, status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/testimonials/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        showToast(status === 'Validé' ? '✅ Témoignage validé — visible sur le site' : 'Témoignage refusé');
        fetchTestimonials();
      }
    } catch (e) {
      showToast('Erreur', 'error');
    }
  };

  const safe = Array.isArray(testimonials) ? testimonials : [];
  const pending = safe.filter(t => t.status === 'En attente');
  const validated = safe.filter(t => t.status === 'Validé');
  const refused = safe.filter(t => t.status === 'Refusé');

  const displayed = activeTab === 'pending' ? pending : activeTab === 'validated' ? validated : refused;

  const getStatusBadge = (status) => {
    if (status === 'Validé') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">Validé</span>;
    if (status === 'Refusé') return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">Refusé</span>;
    return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">En attente</span>;
  };

  return (
    <>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-button text-sm transition-all ${
          toast.type === 'error' ? 'bg-error' : 'bg-green-600'
        }`}>
          <span className="material-symbols-outlined text-xl">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion des Témoignages</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Témoignages</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Validez les témoignages soumis par les agents ou ajoutez-en directement.
          </p>
        </div>
        <button
          onClick={() => { setEditingTestimonial(null); setFormData({ name: '', location: '', text: '', avatar_url: '', file: null, order: 0 }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter un Témoignage
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 bg-surface-container-low p-1.5 rounded-2xl w-fit">
        {[
          { key: 'pending', label: 'En attente', count: pending.length, icon: 'hourglass_empty', color: 'text-amber-600' },
          { key: 'validated', label: 'Validés', count: validated.length, icon: 'check_circle', color: 'text-green-600' },
          { key: 'refused', label: 'Refusés', count: refused.length, icon: 'cancel', color: 'text-red-500' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white shadow text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            <span className={`material-symbols-outlined text-base ${activeTab === tab.key ? '' : tab.color}`}>{tab.icon}</span>
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerte soumissions en attente */}
      {pending.length > 0 && activeTab !== 'pending' && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setActiveTab('pending')}>
          <span className="material-symbols-outlined text-amber-600">notifications_active</span>
          <p className="text-sm text-amber-700 font-medium">
            <strong>{pending.length} témoignage{pending.length > 1 ? 's' : ''}</strong> soumis par des agents attend{pending.length > 1 ? 'ent' : ''} votre validation.
          </p>
          <span className="ml-auto text-amber-600 font-bold text-sm">Voir →</span>
        </div>
      )}

      {/* Liste */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-7xl block mb-4 opacity-20">rate_review</span>
          <p className="text-lg font-medium">Aucun témoignage dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map(t => (
            <div key={t.id} className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col ${
              t.status === 'En attente' ? 'border-amber-200 ring-1 ring-amber-100' : 'border-outline-variant/20'
            }`}>
              {/* Soumis par un agent */}
              {t.submitted_by && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-outline-variant/10">
                  <span className="material-symbols-outlined text-base text-primary/60">person_pin</span>
                  <span className="text-[10px] text-on-surface-variant">Soumis par <strong>{t.submitted_by}</strong></span>
                  {getStatusBadge(t.status)}
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-sm flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {t.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.location}</p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant italic leading-relaxed border-l-2 border-primary/20 pl-3 flex-1">
                "{t.text}"
              </p>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/10">
                {/* Actions selon statut */}
                {t.status === 'En attente' && (
                  <>
                    <button onClick={() => handleValidate(t.id, 'Validé')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-bold hover:bg-green-200 transition-colors">
                      <span className="material-symbols-outlined text-base">check_circle</span>Valider
                    </button>
                    <button onClick={() => handleValidate(t.id, 'Refusé')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors">
                      <span className="material-symbols-outlined text-base">cancel</span>Refuser
                    </button>
                  </>
                )}
                {t.status === 'Validé' && (
                  <button onClick={() => handleValidate(t.id, 'Refusé')}
                    className="flex items-center gap-1 py-1.5 px-3 bg-surface-container text-on-surface-variant rounded-xl text-xs font-medium hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-sm">block</span>Retirer
                  </button>
                )}
                {t.status === 'Refusé' && (
                  <button onClick={() => handleValidate(t.id, 'Validé')}
                    className="flex items-center gap-1 py-1.5 px-3 bg-green-50 text-green-700 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">check_circle</span>Valider quand même
                  </button>
                )}
                <button onClick={() => handleEdit(t)}
                  className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors" title="Modifier">
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button onClick={() => handleDelete(t.id)}
                  className="p-2 text-error hover:bg-error/10 rounded-xl transition-colors" title="Supprimer">
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Créer/Modifier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">
                {editingTestimonial ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom complet</label>
                <input type="text" required className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Localisation (Ville, Région)</label>
                <input type="text" required className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                  value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Témoignage</label>
                <textarea required className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none mt-1" rows={5}
                  value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Photo (optionnel)</label>
                <input type="file" accept="image/*" className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm mt-1"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], avatar_url: '' })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL avatar (ou laisser vide)</label>
                <input type="url" className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                  value={formData.avatar_url} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value, file: null })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ordre d'affichage</label>
                <input type="number" className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none mt-1"
                  value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-button bg-primary text-white hover:brightness-110 transition-all">
                  {editingTestimonial ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
