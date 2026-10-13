'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import 'leaflet/dist/leaflet.css';

// Répertoire des coordonnées GPS et des positions exactes (calibrées sur la silhouette du Togo)
const TOGO_GEO_DIRECTORY = {
  'savanes': { lat: 10.8631, lng: 0.2072, defaultCity: 'Dapaong', svgX: 38.0, svgY: 18.5, color: '#0d2d0b' },
  'dapaong': { lat: 10.8631, lng: 0.2072, defaultCity: 'Dapaong', svgX: 38.0, svgY: 18.5, color: '#0d2d0b' },
  'mango': { lat: 10.3592, lng: 0.4706, defaultCity: 'Mango', svgX: 39.5, svgY: 24.0, color: '#0d2d0b' },
  'cinkasse': { lat: 11.1097, lng: 0.0097, defaultCity: 'Cinkassé', svgX: 35.0, svgY: 14.0, color: '#0d2d0b' },
  'cinkassé': { lat: 11.1097, lng: 0.0097, defaultCity: 'Cinkassé', svgX: 35.0, svgY: 14.0, color: '#0d2d0b' },

  'kara': { lat: 9.5511, lng: 1.1861, defaultCity: 'Kara', svgX: 46.5, svgY: 36.5, color: '#1a4216' },
  'kara city': { lat: 9.5511, lng: 1.1861, defaultCity: 'Kara', svgX: 46.5, svgY: 36.5, color: '#1a4216' },
  'bassar': { lat: 9.2500, lng: 0.7833, defaultCity: 'Bassar', svgX: 40.0, svgY: 42.0, color: '#1a4216' },
  'bafilo': { lat: 9.3500, lng: 1.2667, defaultCity: 'Bafilo', svgX: 48.0, svgY: 40.0, color: '#1a4216' },

  'centrale': { lat: 8.9833, lng: 1.1333, defaultCity: 'Sokodé', svgX: 51.5, svgY: 51.5, color: '#914d00' },
  'sokode': { lat: 8.9833, lng: 1.1333, defaultCity: 'Sokodé', svgX: 51.5, svgY: 51.5, color: '#914d00' },
  'sokodé': { lat: 8.9833, lng: 1.1333, defaultCity: 'Sokodé', svgX: 51.5, svgY: 51.5, color: '#914d00' },
  'tchamba': { lat: 9.0333, lng: 1.4167, defaultCity: 'Tchamba', svgX: 56.0, svgY: 51.0, color: '#914d00' },
  'sotouboua': { lat: 8.5667, lng: 0.9833, defaultCity: 'Sotouboua', svgX: 48.0, svgY: 57.0, color: '#914d00' },

  'plateaux': { lat: 7.5333, lng: 1.1333, defaultCity: 'Atakpamé', svgX: 52.8, svgY: 69.5, color: '#4f3228' },
  'atakpame': { lat: 7.5333, lng: 1.1333, defaultCity: 'Atakpamé', svgX: 52.8, svgY: 69.5, color: '#4f3228' },
  'atakpamé': { lat: 7.5333, lng: 1.1333, defaultCity: 'Atakpamé', svgX: 52.8, svgY: 69.5, color: '#4f3228' },
  'kpalime': { lat: 6.9000, lng: 0.6333, defaultCity: 'Kpalimé', svgX: 45.0, svgY: 76.0, color: '#4f3228' },
  'kpalimé': { lat: 6.9000, lng: 0.6333, defaultCity: 'Kpalimé', svgX: 45.0, svgY: 76.0, color: '#4f3228' },
  'badou': { lat: 7.5833, lng: 0.6000, defaultCity: 'Badou', svgX: 43.0, svgY: 68.0, color: '#4f3228' },

  'maritime': { lat: 6.1375, lng: 1.2125, defaultCity: 'Lomé', svgX: 55.0, svgY: 86.5, color: '#0d2d0b' },
  'lome': { lat: 6.1375, lng: 1.2125, defaultCity: 'Lomé', svgX: 55.0, svgY: 86.5, color: '#0d2d0b' },
  'lomé': { lat: 6.1375, lng: 1.2125, defaultCity: 'Lomé', svgX: 55.0, svgY: 86.5, color: '#0d2d0b' },
  'tsevie': { lat: 6.4261, lng: 1.2133, defaultCity: 'Tsévié', svgX: 55.0, svgY: 83.0, color: '#0d2d0b' },
  'tsévié': { lat: 6.4261, lng: 1.2133, defaultCity: 'Tsévié', svgX: 55.0, svgY: 83.0, color: '#0d2d0b' },
  'aneho': { lat: 6.2278, lng: 1.5950, defaultCity: 'Aného', svgX: 61.0, svgY: 88.0, color: '#0d2d0b' },
  'aného': { lat: 6.2278, lng: 1.5950, defaultCity: 'Aného', svgX: 61.0, svgY: 88.0, color: '#0d2d0b' },
};

export default function InteractiveTogoMap({ regions = [], offices = [], onSelectRegion }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [activePoint, setActivePoint] = useState(null);
  
  // PAR DÉFAUT : toujours la Vue Silhouette comme demandé par l'utilisateur !
  const [mapMode, setMapMode] = useState('silhouette');

  // Filtrer SEULEMENT les régions configurées et visibles dans l'admin (is_hidden !== 1)
  const mapPoints = useMemo(() => {
    const activeRegions = (regions || []).filter(r => r.is_hidden !== 1);
    const norm = str => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    return activeRegions.map(region => {
      // Trouver le bureau régional correspondant configuré dans l'admin
      const office = (offices || []).find(o => 
        norm(o.name) === norm(region.name) || 
        norm(o.city) === norm(region.name)
      );

      const cityName = office?.city || region.name;
      const address = office?.address || 'Bureau Régional';
      const phone = office?.phone || '+228 90 00 00 00';

      const cityKey = norm(office?.city);
      const regionKey = norm(region.name);

      // Calculer les coordonnées GPS réelles et l'emplacement sur la silhouette
      const geo = TOGO_GEO_DIRECTORY[cityKey] || 
                  TOGO_GEO_DIRECTORY[regionKey] || 
                  Object.entries(TOGO_GEO_DIRECTORY).find(([k]) => cityKey.includes(k) || regionKey.includes(k))?.[1] || 
                  TOGO_GEO_DIRECTORY['centrale'];

      return {
        id: region.id,
        name: region.name,
        city: cityName,
        address: address,
        phone: phone,
        distributed: region.distributed || '0',
        activity: region.activity || 'Activité de distribution en cours',
        img_url: region.img_url || office?.img_url || '',
        lat: geo.lat,
        lng: geo.lng,
        svgX: geo.svgX,
        svgY: geo.svgY,
        color: geo.color || '#0d2d0b',
      };
    });
  }, [regions, offices]);

  // Initialisation de la carte Leaflet (chargée seulement si le mode GPS est activé)
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current || mapMode !== 'leaflet') return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [8.6195, 1.0],
        zoom: 7,
        minZoom: 6,
        maxZoom: 12,
        maxBounds: [
          [5.5, -0.5],
          [11.8, 2.5]
        ],
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = {};

      mapPoints.forEach((point) => {
        const customHtml = `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white transform transition-transform duration-300 hover:scale-125">
              <span class="material-symbols-outlined text-[16px]">location_on</span>
            </div>
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary rounded-full animate-ping"></div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest text-primary font-bold text-[11px] px-2 py-0.5 rounded-md shadow border border-outline-variant/40">
              ${point.city}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: customHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);

        marker.on('click', () => {
          handleSelectPoint(point);
          map.flyTo([point.lat, point.lng], 8.5, { duration: 0.8 });
        });

        markersRef.current[point.name.toLowerCase()] = marker;
      });

      mapInstanceRef.current = map;
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, mapPoints]);

  const handleSelectPoint = (point) => {
    setActivePoint(point);

    if (onSelectRegion) {
      onSelectRegion(point.name);
    }

    if (mapInstanceRef.current && point.lat && point.lng) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 8.5, { duration: 0.8 });
    }
  };

  const scrollToRegionCard = (regionName) => {
    const id = `region-card-${regionName.toLowerCase()}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-secondary');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-secondary');
      }, 2500);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col gap-4">
      {/* Barre de contrôle : Silhouette par défaut avec possibilité de passer en GPS */}
      <div className="flex items-center justify-between gap-2 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMapMode('silhouette')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === 'silhouette'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            Vue Silhouette
          </button>
          <button
            type="button"
            onClick={() => setMapMode('leaflet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === 'leaflet'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-sm">map</span>
            Carte GPS Réelle
          </button>
        </div>

        <span className="text-[11px] font-medium text-on-surface-variant px-2">
          📍 Cliquez un point
        </span>
      </div>

      {/* Cadre de la carte : Carré 1:1 parfait pour que les points soient 100% harmonisés et JAMAIS décalés */}
      <div className="relative w-full aspect-square bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/30 shadow-organic flex items-center justify-center">
        {mapMode === 'leaflet' ? (
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        ) : (
          <div className="relative w-full h-full p-4 flex items-center justify-center bg-surface-container-lowest">
            {/* Conteneur 1:1 strict superposé à l'image 512x512 */}
            <div className="relative w-full h-full max-w-[400px] max-h-[400px] aspect-square">
              <Image
                className="w-full h-full object-contain drop-shadow-sm select-none pointer-events-none"
                alt="Carte du Togo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZGPvVUTiwjhWcNUjxFP4-OsWdfVyNPqc09AkNb8fbYqlZJXfnq3No3WgTm2ZDqAkFCzBoZyZ1oBVUNQvv2VUmNo6nd4kGxtxG_VWmxrRWVchm92gsxjqFJqP7-hxWmI3hVQkIhnFyrihSLfT2NUpjZbFeGEcIGfSafqJvJswYlWjSI6FjUSlOBxvjkDJGJ-HJ9_NhHXWFmHbrlP5AVSMR2dAFN6hu996W0YR4M7hz-TPwGQzGo6FQqxXdlfU1olK_NuMtgVW_XQ"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />

              {/* Affichage EXCLUSIF des régions actives dans l'admin, harmonisées et parfaitement calées */}
              {mapPoints.map((point) => {
                const isSelected = activePoint?.name.toLowerCase() === point.name.toLowerCase();
                return (
                  <button
                    key={point.id || point.name}
                    type="button"
                    onClick={() => handleSelectPoint(point)}
                    style={{ top: `${point.svgY}%`, left: `${point.svgX}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10"
                    title={`${point.name} (${point.city}) - ${point.address}`}
                  >
                    <span className="relative flex items-center justify-center">
                      <span className={`absolute w-7 h-7 rounded-full ${isSelected ? 'bg-secondary/40 animate-ping' : 'bg-primary/20 group-hover:scale-150'} transition-transform duration-300`}></span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-md border-2 border-white transition-all duration-300 ${isSelected ? 'bg-secondary scale-125 ring-2 ring-secondary' : 'bg-primary group-hover:scale-110'}`}>
                        📍
                      </span>
                    </span>
                    <span className={`absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-outline-variant/30 transition-all ${isSelected ? 'bg-secondary text-white scale-110 z-20' : 'bg-surface-container-lowest text-on-surface opacity-95 group-hover:opacity-100'}`}>
                      {point.city}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Badge informatif */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-primary shadow border border-outline-variant/30 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {mapPoints.length} Région{mapPoints.length > 1 ? 's' : ''} Active{mapPoints.length > 1 ? 's' : ''} (Admin)
        </div>
      </div>

      {/* Pastilles de sélection rapide des régions actives */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {mapPoints.map((point) => {
          const isSelected = activePoint?.name.toLowerCase() === point.name.toLowerCase();
          return (
            <button
              key={point.id || point.name}
              type="button"
              onClick={() => handleSelectPoint(point)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1 border ${
                isSelected
                  ? 'bg-secondary text-white border-secondary shadow-sm scale-105'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span>📍</span>
              <span>{point.name}</span>
            </button>
          );
        })}
      </div>

      {/* Fiche détaillée interactive affichant l'adresse réelle de l'admin */}
      {activePoint && (
        <div className="p-4 bg-surface-container-lowest rounded-2xl border-2 border-primary/20 shadow-organic animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                  Région {activePoint.name}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {activePoint.city}
                </span>
              </div>
              <h4 className="font-headline-sm text-lg font-bold text-primary mt-1">
                Point Relais : {activePoint.city}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setActivePoint(null)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              title="Fermer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold text-secondary block">Impact Local</span>
              <span className="text-base font-extrabold text-primary">{activePoint.distributed}</span>
              <span className="text-[10px] text-on-surface-variant block">foyers équipés</span>
            </div>
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Adresse Admin</span>
              <span className="font-semibold text-on-surface truncate block" title={activePoint.address}>
                {activePoint.address}
              </span>
              <a href={`tel:${activePoint.phone}`} className="font-bold text-secondary hover:underline block truncate mt-0.5">
                {activePoint.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant italic truncate max-w-[200px]">
              {activePoint.activity}
            </span>
            <button
              type="button"
              onClick={() => scrollToRegionCard(activePoint.name)}
              className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Voir la région</span>
              <span className="material-symbols-outlined text-xs">arrow_downward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
