'use client';

import { useState, useEffect } from 'react';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    file: null,
    order: 0,
  });

  const fetchPartners = async () => {
    const res = await fetch('/api/partners/');
    const data = await res.json();
    setPartners(data);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('order', formData.order.toString());
    if (formData.file) {
      formDataObj.append('file', formData.file);
    }
    if (formData.logo_url) {
      formDataObj.append('logo_url', formData.logo_url);
    }

    const url = editingPartner
      ? `/api/partners/${editingPartner.id}`
      : '/api/partners/';
    const method = editingPartner ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj,
    });

    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      logo_url: '',
      file: null,
      order: 0,
    });
    fetchPartners();
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      file: null,
      order: partner.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire?')) {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      fetchPartners();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion des Partenaires</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Partenaires</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Ajoutez et gérez les logos des partenaires affichés sur le site.</p>
        </div>
        <button
          onClick={() => {
            setEditingPartner(null);
            setFormData({
              name: '',
              logo_url: '',
              file: null,
              order: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter un Partenaire
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden p-6 flex items-center gap-4">
            <div className="w-24 h-24 flex items-center justify-center">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="material-symbols-outlined text-outline text-4xl">business</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-headline-sm text-headline-sm text-primary">{partner.name}</h4>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(partner)}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                onClick={() => handleDelete(partner.id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingPartner ? 'Modifier le Partenaire' : 'Ajouter un Partenaire'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom du Partenaire</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger un logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], logo_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL du logo</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value, file: null })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ordre d'affichage</label>
                <input
                  type="number"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg font-button bg-primary text-white hover:brightness-110 transition-all"
                >
                  {editingPartner ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
