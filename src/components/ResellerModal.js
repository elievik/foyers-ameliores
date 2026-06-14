'use client';

import { useState } from 'react';

export default function ResellerModal() {
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    telephone: '',
    ville: '',
    region: '',
    autre: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/resellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ nom: '', prenoms: '', telephone: '', ville: '', region: '', autre: '' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowResellerModal(true)}
        className="bg-primary-container text-on-primary px-10 py-5 rounded-xl font-button text-button border border-on-primary/20 hover:bg-on-primary-fixed-variant transition-all"
      >
        Devenir Revendeur
      </button>

      {showResellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-primary">Devenez Revendeur</h2>
                <button
                  onClick={() => { setShowResellerModal(false); setSuccess(false); }}
                  className="text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-6xl mb-4">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-primary mb-2">Demande envoyée !</h3>
                  <p className="text-on-surface-variant mb-6">Nous vous recontacterons très prochainement.</p>
                  <button
                    onClick={() => { setShowResellerModal(false); setSuccess(false); }}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-button"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Nom</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Prénoms</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Vos prénoms"
                        value={formData.prenoms}
                        onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Numéro de téléphone</label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                      placeholder="+228 90 00 00 00"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Ville</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Votre ville"
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs block mb-2">Région</label>
                      <select
                        required
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      >
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
                    <textarea
                      className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all h-24"
                      placeholder="Information supplémentaire..."
                      value={formData.autre}
                      onChange={(e) => setFormData({ ...formData, autre: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowResellerModal(false)}
                      className="flex-1 bg-surface-container text-on-surface py-3 rounded-lg font-button hover:bg-surface-container-low transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-button hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
