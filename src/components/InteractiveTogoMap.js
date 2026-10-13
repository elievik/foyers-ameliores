'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import 'leaflet/dist/leaflet.css';

// Vraies coordonnées GPS des 5 régions administratives du Togo et de leurs chefs-lieux
const TOGO_REGIONS_GEO = [
  {
    name: 'Savanes',
    city: 'Dapaong',
    lat: 10.8631,
    lng: 0.2072,
    subCities: ['Dapaong', 'Cinkassé', 'Mango'],
    svgX: 48, // Pourcentage horizontal sur la silhouette du Togo
    svgY: 12, // Pourcentage vertical
    color: '#0d2d0b',
  },
  {
    name: 'Kara',
    city: 'Kara',
    lat: 9.5511,
    lng: 1.1861,
    subCities: ['Kara', 'Bafilo', 'Bassar'],
    svgX: 53,
    svgY: 32,
    color: '#1a4216',
  },
  {
    name: 'Centrale',
    city: 'Sokodé',
    lat: 8.9833,
    lng: 1.1333,
    subCities: ['Sokodé', 'Tchamba', 'Sotouboua'],
    svgX: 51,
    svgY: 51,
    color: '#914d00',
  },
  {
    name: 'Plateaux',
    city: 'Atakpamé & Kpalimé',
    lat: 7.5333,
    lng: 1.1333,
    subCities: ['Atakpamé', 'Kpalimé', 'Badou'],
    svgX: 47,
    svgY: 71,
    color: '#4f3228',
  },
  {
    name: 'Maritime',
    city: 'Lomé',
    lat: 6.1375,
    lng: 1.2125,
    subCities: ['Lomé', 'Tsévié', 'Aného'],
    svgX: 52,
    svgY: 91,
    color: '#0d2d0b',
  },
];

export default function InteractiveTogoMap({ regions = [], offices = [], onSelectRegion }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [activeRegion, setActiveRegion] = useState(null);
  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' ou 'silhouette'
  const [isMapReady, setIsMapReady] = useState(false);

  // Trouver les données associées pour une région
  const getRegionData = (regionName) => {
    const reg = regions.find(r => r.name.toLowerCase() === regionName.toLowerCase());
    const office = offices.find(o => o.name?.toLowerCase() === regionName.toLowerCase());
    const geo = TOGO_REGIONS_GEO.find(g => g.name.toLowerCase() === regionName.toLowerCase());
    return {
      geo,
      name: regionName,
      distributed: reg?.distributed || '0',
      activity: reg?.activity || 'Activité de distribution en cours',
      img_url: reg?.img_url || '',
      officeCity: office?.city || geo?.city,
      phone: office?.phone || '+228 90 00 00 00',
      address: office?.address || 'Bureau Régional',
    };
  };

  // Initialisation de la carte Leaflet
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current || mapMode !== 'leaflet') return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Nettoyer l'ancienne instance si elle existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Centre du Togo : 8.6° N, 1.0° E avec bornes de navigation
      const map = L.map(mapContainerRef.current, {
        center: [8.6195, 1.0],
        zoom: 7,
        minZoom: 6,
        maxZoom: 12,
        maxBounds: [
          [5.5, -0.5], // Sud-Ouest
          [11.8, 2.5]  // Nord-Est
        ],
        zoomControl: false,
        attributionControl: false,
      });

      // Positionner le contrôle de zoom en haut à droite
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tuiles claires et modernes (CartoDB Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Création des marqueurs personnalisés pour chaque région
      markersRef.current = {};

      TOGO_REGIONS_GEO.forEach((geo) => {
        const data = getRegionData(geo.name);

        const customHtml = `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white transform transition-transform duration-300 hover:scale-125">
              <span class="material-symbols-outlined text-[16px]">location_on</span>
            </div>
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary rounded-full animate-ping"></div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest text-primary font-bold text-[11px] px-2 py-0.5 rounded-md shadow border border-outline-variant/40">
              ${geo.city}
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

        const marker = L.marker([geo.lat, geo.lng], { icon }).addTo(map);

        marker.on('click', () => {
          handleSelectRegion(geo.name);
          map.flyTo([geo.lat, geo.lng], 8.5, { duration: 0.8 });
        });

        markersRef.current[geo.name.toLowerCase()] = marker;
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, regions, offices]);

  const handleSelectRegion = (regionName) => {
    const data = getRegionData(regionName);
    setActiveRegion(data);

    if (onSelectRegion) {
      onSelectRegion(regionName);
    }

    // Centrer la carte Leaflet si disponible
    if (mapInstanceRef.current && data.geo) {
      mapInstanceRef.current.flyTo([data.geo.lat, data.geo.lng], 8.5, { duration: 0.8 });
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
      {/* Barre d'actions & sélecteur de mode */}
      <div className="flex items-center justify-between gap-2 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-1">
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
        </div>

        <span className="text-[11px] font-medium text-on-surface-variant px-2">
          📍 Cliquez un point
        </span>
      </div>

      {/* Conteneur de la carte */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/30 shadow-organic">
        {mapMode === 'leaflet' ? (
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        ) : (
          <div className="w-full h-full relative p-6 flex items-center justify-center bg-surface-container-lowest">
            {/* Silhouette / Fond de carte illustré */}
            <div className="w-full h-full relative max-w-[280px]">
              <Image
                className="w-full h-full object-contain opacity-90 drop-shadow-md select-none pointer-events-none"
                alt="Carte du Togo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZGPvVUTiwjhWcNUjxFP4-OsWdfVyNPqc09AkNb8fbYqlZJXfnq3No3WgTm2ZDqAkFCzBoZyZ1oBVUNQvv2VUmNo6nd4kGxtxG_VWmxrRWVchm92gsxjqFJqP7-hxWmI3hVQkIhnFyrihSLfT2NUpjZbFeGEcIGfSafqJvJswYlWjSI6FjUSlOBxvjkDJGJ-HJ9_NhHXWFmHbrlP5AVSMR2dAFN6hu996W0YR4M7hz-TPwGQzGo6FQqxXdlfU1olK_NuMtgVW_XQ"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
              />

              {/* Vrais points géographiques positionnés sur le Togo */}
              {TOGO_REGIONS_GEO.map((geo) => {
                const isSelected = activeRegion?.name.toLowerCase() === geo.name.toLowerCase();
                return (
                  <button
                    key={geo.name}
                    type="button"
                    onClick={() => handleSelectRegion(geo.name)}
                    style={{ top: `${geo.svgY}%`, left: `${geo.svgX}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10"
                    title={`Région ${geo.name} (${geo.city})`}
                  >
                    <span className="relative flex items-center justify-center">
                      <span className={`absolute w-8 h-8 rounded-full ${isSelected ? 'bg-secondary/40 animate-ping' : 'bg-primary/20 group-hover:scale-150'} transition-transform duration-300`}></span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-md border-2 border-white transition-all duration-300 ${isSelected ? 'bg-secondary scale-125 ring-2 ring-secondary' : 'bg-primary group-hover:scale-110'}`}>
                        📍
                      </span>
                    </span>
                    <span className={`absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-outline-variant/30 transition-all ${isSelected ? 'bg-secondary text-white scale-110' : 'bg-surface-container-lowest text-on-surface opacity-90 group-hover:opacity-100'}`}>
                      {geo.city}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Badge indicateur d'échelle */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-primary shadow border border-outline-variant/30 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          5 Régions Géolocalisées
        </div>
      </div>

      {/* Barre de boutons rapides pour les 5 régions */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {TOGO_REGIONS_GEO.map((geo) => {
          const isSelected = activeRegion?.name.toLowerCase() === geo.name.toLowerCase();
          return (
            <button
              key={geo.name}
              type="button"
              onClick={() => handleSelectRegion(geo.name)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1 border ${
                isSelected
                  ? 'bg-secondary text-white border-secondary shadow-sm scale-105'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span>📍</span>
              <span>{geo.name}</span>
            </button>
          );
        })}
      </div>

      {/* Fiche détaillée interactive au clic sur un point */}
      {activeRegion && (
        <div className="p-4 bg-surface-container-lowest rounded-2xl border-2 border-primary/20 shadow-organic animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                  Région {activeRegion.name}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {activeRegion.officeCity}
                </span>
              </div>
              <h4 className="font-headline-sm text-lg font-bold text-primary mt-1">
                Point Relais : {activeRegion.officeCity}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setActiveRegion(null)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              title="Fermer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold text-secondary block">Impact Local</span>
              <span className="text-base font-extrabold text-primary">{activeRegion.distributed}</span>
              <span className="text-[10px] text-on-surface-variant block">foyers équipés</span>
            </div>
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Contact Bureau</span>
              <a href={`tel:${activeRegion.phone}`} className="font-bold text-secondary hover:underline block truncate">
                {activeRegion.phone}
              </a>
              <span className="text-[10px] text-on-surface-variant truncate block">{activeRegion.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant italic truncate max-w-[200px]">
              {activeRegion.activity}
            </span>
            <button
              type="button"
              onClick={() => scrollToRegionCard(activeRegion.name)}
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
