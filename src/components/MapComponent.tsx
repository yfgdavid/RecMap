// src/components/MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Limites e centro do Recife
const recifeCenter: [number, number] = [-8.0476, -34.877];
const recifeBounds: [[number, number], [number, number]] = [
  [-8.12, -34.94],
  [-7.95, -34.80],
];

// Dados mockados de marcadores
interface MarkerData {
  id: number;
  position: [number, number];
  title: string;
  type: 'denuncia' | 'certo' | 'encaminhada';
}

const markers: MarkerData[] = [
  { id: 1, position: [-8.045, -34.875], title: 'Denúncia', type: 'denuncia' },
  { id: 2, position: [-8.050, -34.880], title: 'Local de descarte correto', type: 'certo' },
  { id: 3, position: [-8.042, -34.870], title: 'Denuncia encaminhada', type: 'encaminhada' },
];

// Função para retornar cor do marcador
const getMarkerColor = (type: MarkerData['type']) => {
  switch (type) {
    case 'denuncia': return '#FF2C2C';
    case 'certo': return '#069240';
    case 'encaminhada': return '#FFA500';
    default: return '#0000FF';
  }
};

// Criar ícone colorido
const createColoredIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background-color:${color};
      width:20px;
      height:20px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 2px rgba(0,0,0,0.6);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Componente para centralizar mapa na posição do usuário
const FlyToUser = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16); // zoom 16
    }
  }, [position, map]);
  return null;
};

const MapComponent = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // Pegar localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Não foi possível obter localização:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <MapContainer
      center={recifeCenter}
      zoom={15}
      minZoom={14}
      maxZoom={18}
      style={{ height: '500px', width: '100%' }}
      maxBounds={recifeBounds}
      maxBoundsViscosity={1.0}
    >
      {/* Mapa base */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de coleta */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={createColoredIcon(getMarkerColor(marker.type))}
        >
          <Popup>{marker.title}</Popup>
        </Marker>
      ))}

      {/* Marcador do usuário */}
      {userPosition && (
        <>
          <FlyToUser position={userPosition} />
          <Marker
            position={userPosition}
            icon={L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // ícone do usuário
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          >
            <Popup>Você está aqui</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;
