// src/components/MapComponent.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";

// Limites e centro do Recife
const recifeCenter: [number, number] = [-8.0476, -34.877];
const recifeBounds: [[number, number], [number, number]] = [
  [-8.164, -34.976], // sudoeste: extremo inferior esquerdo
  [-7.903, -34.841], // nordeste: extremo superior direito
];

// Tipos de dados
interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  status: string;
  foto?: string; // adicionado
}

interface PontoColeta {
  id: number;
  titulo: string;
  descricao: string;
  tipo_residuo: string;
  latitude: number;
  longitude: number;
  foto?: string; // adicionado
}

interface MapaData {
  denuncias: Denuncia[];
  pontos: PontoColeta[];
}

// Criar ícone colorido
const createColoredIcon = (color: string) =>
  L.divIcon({
    className: "",
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

// Centralizar mapa na posição do usuário
const FlyToUser = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position, map]);
  return null;
};

const MapComponent = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [dadosMapa, setDadosMapa] = useState<MapaData>({ denuncias: [], pontos: [] });

  // Buscar dados do backend
  useEffect(() => {
    async function carregarMapa() {
      try {
        const res = await api.get("/mapa");
        const data = res.data;

        // Mapear denúncias
        const denuncias: Denuncia[] = data
          .filter((item: any) => item.tipo === "denuncia")
          .map((d: any, i: number) => ({
            id: d.id,
            titulo: d.titulo,
            descricao: d.descricao,
            latitude: d.latitude + i * 0.00005,
            longitude: d.longitude + i * 0.00005,
            status: d.status || "PENDENTE",
            foto: d.foto || undefined,
          }));

        // Mapear pontos de coleta
        const pontos: PontoColeta[] = data
          .filter((item: any) => item.tipo === "ponto")
          .map((p: any) => ({
            id: p.id,
            titulo: p.titulo,
            descricao: p.descricao,
            tipo_residuo: p.tipo_residuo || "",
            latitude: p.latitude,
            longitude: p.longitude,
            foto: p.foto || undefined,
          }));

        setDadosMapa({ denuncias, pontos });
      } catch (error) {
        console.error("Erro ao carregar dados do mapa:", error);
      }
    }
    carregarMapa();
  }, []);

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Não foi possível obter localização:", err),
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
      style={{ height: "500px", width: "100%" }}
      maxBounds={recifeBounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de Denúncias */}
      {dadosMapa.denuncias.map((denuncia) => (
        <Marker
          key={`den-${denuncia.id}`}
          position={[denuncia.latitude, denuncia.longitude]}
          icon={createColoredIcon(
            denuncia.status.toLowerCase() === "encaminhada" ? "#FFA500" : "#FF2C2C"
          )}
        >
          <Popup>
            <div className="space-y-2">
              <strong>{denuncia.titulo}</strong>
              <p className="text-sm text-gray-600">{denuncia.descricao}</p>
              {denuncia.foto && (
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <img
                    src={denuncia.foto}
                    alt={denuncia.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marcadores de Pontos de Coleta */}
      {dadosMapa.pontos.map((ponto) => (
        <Marker
          key={`ponto-${ponto.id}`}
          position={[ponto.latitude, ponto.longitude]}
          icon={createColoredIcon("#069240")}
        >
          <Popup>
            <div className="space-y-2">
              <strong>{ponto.titulo}</strong>
              <p className="text-sm text-gray-600">{ponto.tipo_residuo}</p>
              {ponto.foto && (
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <img
                    src={ponto.foto}
                    alt={ponto.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marcador do usuário */}
      {userPosition && (
        <>
          <FlyToUser position={userPosition} />
          <Marker
            position={userPosition}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
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
