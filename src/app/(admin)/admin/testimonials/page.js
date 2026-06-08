'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: '',
    avatar_url: '',
    file: null,
    order: 0,
  });

  const fetchTestimonials = async () => {
    const res = await fetch('/api/testimonials/');
    const data = await res.json();
    setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('location', formData.location);
    formDataObj.append('text', formData.text);
    formDataObj.append('order', formData.order.toString());
    if (formData.file) {
      const compressedFile = await compressImage(formData.file);
      formDataObj.append('file', compressedFile);
    }
    if (formData.avatar_url) {
      formDataObj.append('avatar_url', formData.avatar_url);
    }

    const url = editingTestimonial
      ? `/api/testimonials/${editingTestimonial.id}`
      : '/api/testimonials/';
    const method = editingTestimonial ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj,
    });

    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      text: '',
      avatar_url: '',
      file: null,
      order: 0,
    });
    fetchTestimonials();
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      text: testimonial.text,
      avatar_url: testimonial.avatar_url,
      file: null,
      order: testimonial.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?')) {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion des Témoignages</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Témoignages des Bénéficiaires</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Ajoutez et gérez les témoignages affichés sur la page d'accueil.</p>
        </div>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setFormData({
              name: '',
              location: '',
              text: '',
              avatar_url: '',
              file: null,
              order: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter un Témoignage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="glass-card p-8 rounded-3xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-fixed overflow-hidden relative border border-primary/20 shadow-sm">
                <img
                  src={testimonial.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARSlszM-dYLNt6m2F8mt77TmwWzZlhUGujfMdcPD_7wF5I1sLPPSqZTZ8wA8paF-_9tmJsrgN8LpByQg5NMWyRnZP3-PDAnHvMWcCb8s-Gdk5Q6kTGHkz71NLYlfgimo2ieu1a9OPuPzIpV0Lmsa9QUnG2dPNj9zEAMWpCFA5i_4TspLQB53BvspYmdxUs4-tOrYIBaZoG-288C0Ng6nOeJaokNGjInnPIYNXslN-kaaM6tvUeHOJQYrTp_1fYK9WTK8G4S13ttw'}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">{testimonial.location}</p>
              </div>
            </div>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">"{testimonial.text}"</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">edit</span>Modifier
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-error bg-error/10 hover:bg-error/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">delete</span>Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingTestimonial ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom complet</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Localisation (Ville, Région)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Texte du témoignage</label>
                <textarea
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  rows={5}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger un avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], avatar_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL de l'avatar (optionnel)</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value, file: null })}
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
