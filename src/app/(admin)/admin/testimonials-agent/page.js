'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://foyers-ameliores.onrender.com';

export default function AgentTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [agentEmail, setAgentEmail] = useState('');
  const [agentRegion, setAgentRegion] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: '',
    file: null,
  });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const profile = localStorage.getItem('adminProfile');
    if (!localStorage.getItem('isLoggedIn')) {
      router.push('/login');
      return;
    }
    if (profile) {
      const p = JSON.parse(profile);
      setAgentEmail(p.email || '');
      setAgentRegion(p.region || '');
    }
    fetchMyTestimonials();
  }, [router]);

  async function fetchMyTestimonials() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/testimonials/all`);
      if (res.ok) {
        const data = await res.json();
        const profile = JSON.parse(localStorage.getItem('adminProfile') || '{}');
        const email = profile.email || '';
        // Agents see only their own submissions
        const mine = data.filter(t => t.submitted_by === email);
        setTestimonials(mine);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(f => ({ ...f, file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('location', formData.location || agentRegion || 'Togo');
      fd.append('text', formData.text);
      fd.append('status', 'En attente');
      fd.append('submitted_by', agentEmail);
      fd.append('order', '0');

      if (formData.file) {
        const compressed = await compressImage(formData.file);
        fd.append('file', compressed);
      }

      const res = await fetch(`${BACKEND_URL}/api/testimonials/`, {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        showToast('Témoignage soumis ! Il sera visible après validation par l\'admin.');
        setShowForm(false);
        setFormData({ name: '', location: '', text: '', file: null });
        setImagePreview(null);
        fetchMyTestimonials();
      } else {
        showToast('Erreur lors de la soumission.', 'error');
      }
    } catch (err) {
      showToast('Erreur de connexion.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Validé':
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase"><span className="material-symbols-outlined text-xs">check_circle</span>Validé — Visible sur le site</span>;
      case 'Refusé':
        return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase"><span className="material-symbols-outlined text-xs">cancel</span>Refusé</span>;
      default:
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase"><span className="material-symbols-outlined text-xs">hourglass_empty</span>En attente de validation</span>;
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

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            {agentRegion ? `Agent — ${agentRegion}` : 'Espace Agent'}
          </span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Témoignages Clients</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Soumettez les témoignages de vos clients. L'administrateur les validera avant publication sur le site.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Nouveau Témoignage
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6">
        <span className="material-symbols-outlined text-primary mt-0.5">info</span>
        <p className="text-sm text-primary/80">
          Les témoignages soumis sont <strong>en attente de validation</strong> par l'administrateur avant d'apparaître sur le site public.
          Vous pouvez soumettre le témoignage avec ou sans photo du client.
        </p>
      </div>

      {/* Liste des témoignages soumis */}
      {testimonials.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-7xl block mb-4 opacity-20">rate_review</span>
          <p className="text-lg font-medium">Aucun témoignage soumis pour l'instant</p>
          <p className="text-sm mt-1">Cliquez sur "Nouveau Témoignage" pour en ajouter un.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-sm flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {t.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.location}</p>
                  <div className="mt-2">{getStatusBadge(t.status)}</div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed border-l-2 border-primary/20 pl-3">
                "{t.text}"
              </p>
              {t.created_at && (
                <p className="text-[10px] text-on-surface-variant mt-3 text-right uppercase tracking-wider">
                  Soumis le {new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">Nouveau Témoignage</h3>
                <p className="text-xs text-on-surface-variant mt-1">Ce témoignage sera soumis pour validation</p>
              </div>
              <button onClick={() => { setShowForm(false); setImagePreview(null); }} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo client */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-2">
                  Photo du client <span className="text-on-surface-variant/60 normal-case font-normal">(optionnelle)</span>
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-medium text-primary hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-base">upload</span>
                    {imagePreview ? 'Changer la photo' : 'Ajouter une photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  {imagePreview && (
                    <button type="button" onClick={() => { setImagePreview(null); setFormData(f => ({ ...f, file: null })); }}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nom client */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Nom du client *</label>
                <input required
                  className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex: Koffi Amégbor"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Ville / Village *</label>
                <input required
                  className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex: Lomé, Maritime"
                  value={formData.location}
                  onChange={(e) => setFormData(f => ({ ...f, location: e.target.value }))}
                />
              </div>

              {/* Témoignage */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Témoignage *</label>
                <textarea required
                  className="w-full bg-surface-container-low rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 h-32 resize-none"
                  placeholder="Ce que le client a dit de son expérience avec le foyer amélioré..."
                  value={formData.text}
                  onChange={(e) => setFormData(f => ({ ...f, text: e.target.value }))}
                />
                <p className="text-[10px] text-on-surface-variant mt-1">{formData.text.length}/500 caractères</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-base mt-0.5">pending</span>
                <p className="text-xs text-amber-700">Ce témoignage sera en attente de validation par l'administrateur avant publication.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setImagePreview(null); }}
                  className="flex-1 bg-surface-container text-on-surface py-3 rounded-xl font-button hover:bg-surface-container-high transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-button hover:brightness-110 transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi...</>
                  ) : (
                    <><span className="material-symbols-outlined text-base">send</span>Soumettre</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
