'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    icon: 'person',
    img_url: '',
    file: null,
    order: 0,
  });

  const fetchTeam = async () => {
    const res = await fetch(`${BACKEND_URL}/api/team/`);
    const data = await res.json();
    setTeam(Array.isArray(data) ? data : []);
  };

  const safeTeam = Array.isArray(team) ? team : [];

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('role', formData.role);
    formDataObj.append('icon', formData.icon);
    formDataObj.append('order', formData.order.toString());
    if (formData.file) {
      const compressedFile = await compressImage(formData.file);
      formDataObj.append('file', compressedFile);
    }
    if (formData.img_url) {
      formDataObj.append('img_url', formData.img_url);
    }

    const url = editingMember
      ? `${BACKEND_URL}/api/team/${editingMember.id}`
      : `${BACKEND_URL}/api/team/`;
    const method = editingMember ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      body: formDataObj,
    });

    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      icon: 'person',
      img_url: '',
      file: null,
      order: 0,
    });
    fetchTeam();
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      icon: member.icon,
      img_url: member.img_url,
      file: null,
      order: member.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
      await fetch(`${BACKEND_URL}/api/team/${id}`, { method: 'DELETE' });
      fetchTeam();
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Gestion de l'Équipe</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Membres de l'Équipe</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérer l'équipe de coordination affichée sur la page À Propos.</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormData({
              name: '',
              role: '',
              icon: 'person',
              img_url: '',
              file: null,
              order: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>Ajouter un Membre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {safeTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col items-center text-center"
          >
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-surface-container">
                {member.img_url ? (
                  <img className="w-full h-full object-cover" alt={member.name} src={member.img_url} />
                ) : (
                  <span className="material-symbols-outlined text-outline text-6xl">{member.icon}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined">{member.icon}</span>
              </div>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary">{member.name}</h4>
            <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider mb-4">{member.role}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">edit</span>Modifier
              </button>
              <button
                onClick={() => handleDelete(member.id)}
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingMember ? 'Modifier le Membre' : 'Ajouter un Membre'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom Complet</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rôle</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger une photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], img_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL de la photo</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.img_url}
                  onChange={(e) => setFormData({ ...formData, img_url: e.target.value, file: null })}
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
                  {editingMember ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
