'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminRegions() {
  const [regions, setRegions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    distributed: '0',
    icon: 'public',
    activity: 'Aucune activité enregistrée',
    quote: '',
    cite: '',
    img_url: '',
    file: null,
    order: 0,
  });

  const fetchRegions = async () => {
    const res = await fetch('/api/regions/');
    const data = await res.json();
    setRegions(data);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('distributed', formData.distributed);
    formDataObj.append('icon', formData.icon);
    formDataObj.append('activity', formData.activity);
    formDataObj.append('quote', formData.quote);
    formDataObj.append('cite', formData.cite);
    formDataObj.append('order', formData.order.toString());
    if (formData.file) {
      formDataObj.append('file', formData.file);
    }
    if (formData.img_url) {
      formDataObj.append('img_url', formData.img_url);
    }

    const url = editingRegion
      ? `/api/regions/${editingRegion.id}`
      : '/api/regions/';
    const method = editingRegion ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj,
    });

    setIsModalOpen(false);
    setEditingRegion(null);
    setFormData({
      name: '',
      distributed: '0',
      icon: 'public',
      activity: 'Aucune activité enregistrée',
      quote: '',
      cite: '',
      img_url: '',
      file: null,
      order: 0,
    });
    fetchRegions();
  };

  const handleEdit = (region) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      distributed: region.distributed,
      icon: region.icon,
      activity: region.activity,
      quote: region.quote || '',
      cite: region.cite || '',
      img_url: region.img_url,
      file: null,
      order: region.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette région?')) {
      await fetch(`/api/regions/${id}`, { method: 'DELETE' });
      fetchRegions();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion des Régions</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Régions du Togo</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les informations et images des régions.</p>
        </div>
        <button
          onClick={() => {
            setEditingRegion(null);
            setFormData({
              name: '',
              distributed: '0',
              icon: 'public',
              activity: 'Aucune activité enregistrée',
              quote: '',
              cite: '',
              img_url: '',
              file: null,
              order: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter une Région
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regions.map((region) => (
          <div key={region.id} className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="h-48 relative overflow-hidden flex items-center justify-center bg-surface-container">
              {region.img_url ? (
                <img
                  src={region.img_url}
                  alt={region.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-outline text-6xl">{region.icon}</span>
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(region)}
                  className="p-2 bg-white rounded-full text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(region.id)}
                  className="p-2 bg-white rounded-full text-error hover:bg-error/10 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{region.name}</h3>
              <p className="text-body-md text-on-surface-variant mb-4">{region.distributed} foyers distribués</p>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined">{region.icon}</span>
                <span className="font-label-caps text-label-caps">{region.activity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingRegion ? 'Modifier la Région' : 'Ajouter une Région'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom de la Région</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Distribué</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.distributed}
                  onChange={(e) => setFormData({ ...formData, distributed: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Icône (Material Symbols)</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Dernière Activité</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Témoignage (Optionnel)</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  rows={3}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Auteur du Témoignage (Optionnel)</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.cite}
                  onChange={(e) => setFormData({ ...formData, cite: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger une image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], img_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL de l'image</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={formData.img_url}
                  onChange={(e) => setFormData({ ...formData, img_url: e.target.value, file: null })}
                  placeholder="https://..."
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
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-button bg-primary text-white hover:brightness-110 transition-all"
                >
                  {editingRegion ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
