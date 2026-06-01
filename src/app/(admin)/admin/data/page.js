'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function AdminData() {
  const [hiddenRegions, setHiddenRegions] = useState([]);
  const [photos, setPhotos] = useState([1,2,3,4,5].map(idx => ({ id: idx, url: `https://picsum.photos/seed/${idx + 100}/400/400` })));
  const regions = [
    { name: 'Maritime', color: 'bg-primary', distributed: '0', tag: 'Sud-Côtier', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3BSFo3VyBOZiTzQ3-iR2fXkwA7I15jATueu09zNlyBKja1b-JQ4MOzrD7dy54fqsbAtEhXe8vSF2EFkbjsUAIzq57gApPjlVaQ2lazPVcodTVTd231utTWkPLUo2deT8lPPPis7-EZ5US4KAu8oZApss2lwuuS8MoN0ucDc0dq33gkSCRjCbsx6qa98T1dbsxxUQjr7s68A5n51ZFQYm_fVf7ngYnyGe8g4u3vo5au3J9NHy56w6dxAOAgIyCTqtHcbeTmzHg' },
    { name: 'Plateaux', color: 'bg-secondary', distributed: '0', tag: 'Sud-Haut', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn6YtP9TLjtsYGRQRHOdffIhO_6dIKfplvq2nZEOqvjQp0eqEUnQOfRtf6ZEBRYhotGcJFU-pfQithDhWETQ6Hbh5qJCdw4wClswr07Gv4g7x-gciklNHka-lp1O_RJvYAz3pxtG5q5EuG31VsN1DpXUsrXqByMES53XV4W7YNFlLIw2qbkVd0WuV3WHGE_RgybMFbMKMyYZybyydxJl6G7Eiu3yhx13PX1LB82oMSTEA1yGIRi2efrvHV8mumYm0tsBDBhHFAug' },
    { name: 'Centrale', color: 'bg-primary', distributed: '0', tag: 'Centre', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdMmB9o6bk6pQkKbSv3Rnk8omM1eJq0sU20YqAt1qUJchb0DbmI36aVATDnZXEdgjEZBaZUYhTe4-c3RnHj9oDLQhzcakhClkX4_C_RCrsD1KNWRlZBPJGYekuV2V2rAJFjDps1SOdGl47QEKlPawY9hfbSY2yPojUs76L-AeWY0DfPWHIVx9_y30qUZi8ogUIcB_4GiFtplakST1X6BGUccqvGkEJYjXMYHIMS1KfUcE0k3OuyRHNtfwR0y5dEaI3X-5KATcwiQ' },
    { name: 'Kara', color: 'bg-primary', distributed: '0', tag: 'Nord-Centre', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyJ1dsLRtkxQz7qz8GIQccmsIx6JDjxL9zq584QY1effM1rI8w1oEbBLP0LQHuTU7sY8IhmhGYA2DLBxFi23LpVfHl_V-pQDXNe7iVlf65TzeJ13rzrISOdoK6BwRCllz2ZN6u-ogR8bdLUhazZIbSbDmkilCLIQ92qF-r3l8UPdd7OJNBpLURbbXTKeskcfT73vLjluHTtD1jQ5vVp0MmeTMd3yT3WIkeaJgckVuSjXya7gNfkXLRJ0ndB9ygGdbzD6QFCEgUPQ' },
    { name: 'Savanes', color: 'bg-secondary', distributed: '0', tag: 'Nord', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhRy_AIiPlb6sikjRQUTvevSKYmUIZ6DqOHiJ_17Opyo3cNyif6blInTPLhcopU_VrOS0caP-EJYRftUhKDbDlQGeehtFFy2HoFwEAGKg40J9ztVXictDZrvtGvl9yLeWnf9gE1EiaMjScB2uwVf8_A3uwzBEqtmfKO5PGJjTKyvEgcXu8sZAj833DvLbG7bce7agzNmxTB3certPS1CPWz3hSEyvaDtr-p2G3PmB5cMlVxMPtFn21Bc4TQphvLTHZbkgy2qlBvg' },
  ];

  const toggleRegionVisibility = (regionName) => {
    setHiddenRegions(prev => prev.includes(regionName) ? prev.filter(r => r !== regionName) : [...prev, regionName]);
  };

  const deletePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPhoto = () => {
    // Simulate adding a photo
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
        {regions.filter(r => !hiddenRegions.includes(r.name)).map((region) => (
          <div key={region.name} className="group relative overflow-hidden rounded-3xl h-80 bg-surface-container-low border border-outline-variant/20 shadow-sm hover:shadow-organic transition-all">
            <Image className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt={region.name} src={region.img} fill />
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
