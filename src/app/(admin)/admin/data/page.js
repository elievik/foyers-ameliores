'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AdminData() {
  const [hiddenRegions, setHiddenRegions] = useState([]);
  const [photos, setPhotos] = useState([1,2,3,4,5].map(idx => ({ id: idx, url: `https://picsum.photos/seed/${idx + 100}/400/400` })));
  const [regions, setRegions] = useState([]);

  const fetchRegions = async () => {
    const res = await fetch('/api/regions/');
    const data = await res.json();
    setRegions(data);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const toggleRegionVisibility = (regionName) => {
    setHiddenRegions(prev => prev.includes(regionName) ? prev.filter(r => r !== regionName) : [...prev, regionName]);
  };

  const deletePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPhoto = () => {
    const newId = Date.now();
    setPhotos(prev => [...prev, { id: newId, url: `https://picsum.photos/seed/${newId}/400/400` }]);
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Suivi Géographique</span>
          <h2 className="font-display-lg text-display-lg mt-2 text-primary">Impact Régional</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Visualisez et gérez la distribution nationale à travers les 5 régions du Togo.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-button shadow-lg hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Nouveau Rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {regions
          .filter(r => !hiddenRegions.includes(r.name))
          .map((region) => (
            <div key={region.id} className="group relative overflow-hidden rounded-3xl h-80 bg-surface-container-low border border-outline-variant/20 shadow-sm hover:shadow-organic transition-all">
              {region.img_url ? (
                <Image className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt={region.name} src={region.img_url} fill />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
                  <span className="material-symbols-outlined text-8xl text-outline">{region.icon}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 m-4 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-primary">{region.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleRegionVisibility(region.name)}
                      className="p-2 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-colors"
                      title="Cacher la région"
                    >
                      <span className="material-symbols-outlined">visibility_off</span>
                    </button>
                    <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <div>
                    <p className="text-3xl font-bold text-primary">{region.distributed}</p>
                    <p className="font-label-caps text-[10px] opacity-70 uppercase tracking-widest">Foyers Distribués</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {hiddenRegions.length > 0 && (
          <div className="col-span-full text-center text-on-surface-variant">
            <p className="mb-4">{hiddenRegions.length} région(s) cachée(s): {hiddenRegions.join(', ')}</p>
            <button 
              onClick={() => setHiddenRegions([])}
              className="px-4 py-2 bg-surface-container-high rounded-lg font-body-md hover:bg-surface-container transition-colors"
            >
              Afficher toutes les régions
            </button>
          </div>
        )}
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
            <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm">
              <Image className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Field Photo" src={photo.url} fill />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="w-8 h-8 bg-white rounded-full text-primary flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
                <button 
                  onClick={() => deletePhoto(photo.id)} 
                  className="w-8 h-8 bg-white rounded-full text-error flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
          <div 
            onClick={handleAddPhoto} 
            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
            <span className="text-[10px] font-bold uppercase mt-2">Ajouter</span>
          </div>
        </div>
      </div>
    </>
  );
}
