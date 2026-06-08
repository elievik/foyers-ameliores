'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

export default function AdminData() {
  const [regions, setRegions] = useState([]);
  
  // Modals state
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Forms state
  const [regionFormData, setRegionFormData] = useState({
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

  const [reportFormData, setReportFormData] = useState({
    title: '',
    description: '',
    region: '',
    file: null,
  });

  const [photos, setPhotos] = useState([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const fetchRegions = async () => {
    try {
      const res = await fetch('/api/regions/');
      const data = await res.json();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media/');
      const data = await res.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchMedia();
  }, []);

  const toggleRegionVisibility = async (region) => {
    const newIsHidden = region.is_hidden ? 0 : 1;
    const formDataObj = new FormData();
    formDataObj.append('is_hidden', newIsHidden.toString());
    
    try {
      await fetch(`/api/regions/${region.id}`, {
        method: 'PATCH',
        body: formDataObj,
      });
      fetchRegions();
    } catch (error) {
      console.error('Error updating region visibility:', error);
      alert('Erreur lors de la mise à jour de la visibilité.');
    }
  };

  const handleEditRegion = (region) => {
    setEditingRegion(region);
    setRegionFormData({
      name: region.name,
      distributed: region.distributed,
      icon: region.icon,
      activity: region.activity,
      quote: region.quote || '',
      cite: region.cite || '',
      img_url: region.img_url || '',
      file: null,
      order: region.order,
    });
    setIsRegionModalOpen(true);
  };

  const handleRegionSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', regionFormData.name);
    formDataObj.append('distributed', regionFormData.distributed);
    formDataObj.append('icon', regionFormData.icon);
    formDataObj.append('activity', regionFormData.activity);
    formDataObj.append('quote', regionFormData.quote);
    formDataObj.append('cite', regionFormData.cite);
    formDataObj.append('order', regionFormData.order.toString());
    if (regionFormData.file) {
      const compressedFile = await compressImage(regionFormData.file);
      formDataObj.append('file', compressedFile);
    }
    if (regionFormData.img_url) {
      formDataObj.append('img_url', regionFormData.img_url);
    }

    const url = editingRegion
      ? `/api/regions/${editingRegion.id}`
      : '/api/regions/';
    const method = editingRegion ? 'PATCH' : 'POST';

    try {
      await fetch(url, {
        method,
        body: formDataObj,
      });

      setIsRegionModalOpen(false);
      setEditingRegion(null);
      setRegionFormData({
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
    } catch (error) {
      console.error('Error saving region:', error);
      alert('Erreur lors de la sauvegarde de la région.');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', reportFormData.title);
    formDataObj.append('description', reportFormData.description);
    if (reportFormData.region) {
      formDataObj.append('region', reportFormData.region);
    }
    if (reportFormData.file) {
      const compressedFile = await compressImage(reportFormData.file);
      formDataObj.append('file', compressedFile);
    }

    try {
      await fetch('/api/reports/', {
        method: 'POST',
        body: formDataObj,
      });

      setIsReportModalOpen(false);
      setReportFormData({
        title: '',
        description: '',
        region: '',
        file: null,
      });
      alert('Rapport enregistré avec succès !');
      // Optionnel : recharger les rapports si affichés
    } catch (error) {
      console.error('Error saving report:', error);
      alert("Erreur lors de l'enregistrement du rapport.");
    }
  };

  const deletePhoto = async (filename) => {
    if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return;
    try {
      const res = await fetch(`/api/media/${filename}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMedia();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('file', compressedFile);
    
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchMedia();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Suivi Géographique</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Impact Régional & Rapports</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Gérez les régions, leurs statistiques et enregistrez de nouveaux rapports d'activité de terrain.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setEditingRegion(null);
              setRegionFormData({
                name: '', distributed: '0', icon: 'public', activity: 'Aucune activité enregistrée',
                quote: '', cite: '', img_url: '', file: null, order: 0,
              });
              setIsRegionModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-primary rounded-xl font-button shadow-sm hover:bg-surface-container transition-all active:scale-95 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined">add_location</span>
            Ajouter Région
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Nouveau Rapport
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {regions.map((region) => (
          <div key={region.id} className={`group relative overflow-hidden rounded-3xl h-80 bg-surface-container-low border ${region.is_hidden ? 'border-error/50 opacity-75' : 'border-outline-variant/20'} shadow-sm hover:shadow-organic transition-all`}>
            {region.img_url ? (
              <Image className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt={region.name} src={region.img_url} fill />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
                <span className="material-symbols-outlined text-8xl text-outline">{region.icon}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {region.is_hidden === 1 && (
              <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-lg font-label-caps uppercase text-[10px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                Masquée
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 m-4 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline-sm text-primary">{region.name}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleRegionVisibility(region)}
                    className={`p-2 rounded-full ${region.is_hidden ? 'bg-error text-white' : 'bg-error/10 text-error hover:bg-error hover:text-white'} transition-colors`}
                    title={region.is_hidden ? "Afficher la région" : "Cacher la région temporairement"}
                  >
                    <span className="material-symbols-outlined">
                      {region.is_hidden ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleEditRegion(region)}
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    title="Éditer les informations et l'image"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <div>
                  <p className="text-3xl font-bold text-primary">{region.distributed}</p>
                  <p className="font-label-caps text-[10px] opacity-70 uppercase tracking-widest">Foyers Existant / Distribués</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-low rounded-[40px] p-10 border border-outline-variant/10 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-headline-md text-primary">Médiathèque de Terrain</h3>
            <p className="text-on-surface-variant font-body-md">Photos envoyées par les agents pour validation.</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-button flex items-center gap-2 shadow-lg hover:brightness-110 transition-all">
            <span className="material-symbols-outlined">cloud_upload</span>
            Importer
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((photo) => (
            <div key={photo.name} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-outline-variant/20">
              <Image className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Field Photo" src={photo.url} fill sizes="(max-width: 768px) 50vw, 16vw" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(photo.url);
                    alert('Lien copié dans le presse-papier !');
                  }} 
                  className="w-10 h-10 bg-white rounded-full text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  title="Copier le lien"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.name);
                  }} 
                  className="w-10 h-10 bg-white rounded-full text-error flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  title="Supprimer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
          <label className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer relative overflow-hidden">
            {isUploadingMedia ? (
              <span className="text-[10px] font-bold uppercase mt-2">Chargement...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                <span className="text-[10px] font-bold uppercase mt-2">Ajouter</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploadingMedia} />
          </label>
        </div>
      </div>

      {/* Modal d'Édition de Région */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              {editingRegion ? 'Modifier la Région' : 'Ajouter une Région'}
            </h3>
            <form onSubmit={handleRegionSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nom de la Région</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={regionFormData.name}
                  onChange={(e) => setRegionFormData({ ...regionFormData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Foyers Existants / Distribués</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={regionFormData.distributed}
                  onChange={(e) => setRegionFormData({ ...regionFormData, distributed: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Icône (Material Symbols)</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={regionFormData.icon}
                  onChange={(e) => setRegionFormData({ ...regionFormData, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Dernière Activité</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={regionFormData.activity}
                  onChange={(e) => setRegionFormData({ ...regionFormData, activity: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Télécharger une image (Remplace celle du site)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setRegionFormData({ ...regionFormData, file: e.target.files[0], img_url: '' })}
                />
              </div>
              <div className="text-center text-sm text-on-surface-variant">OU</div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">URL de l'image</label>
                <input
                  type="url"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={regionFormData.img_url}
                  onChange={(e) => setRegionFormData({ ...regionFormData, img_url: e.target.value, file: null })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ordre d'affichage</label>
                <input
                  type="number"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={regionFormData.order}
                  onChange={(e) => setRegionFormData({ ...regionFormData, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegionModalOpen(false)}
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

      {/* Modal Nouveau Rapport */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">Nouveau Rapport</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Titre du Rapport</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={reportFormData.title}
                  onChange={(e) => setReportFormData({ ...reportFormData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Région</label>
                <select
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={reportFormData.region}
                  onChange={(e) => setReportFormData({ ...reportFormData, region: e.target.value })}
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
                <textarea
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  rows={4}
                  value={reportFormData.description}
                  onChange={(e) => setReportFormData({ ...reportFormData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Fichier ou Photo</label>
                <input
                  type="file"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  onChange={(e) => setReportFormData({ ...reportFormData, file: e.target.files[0] })}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-button bg-primary text-white hover:brightness-110 transition-all flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
