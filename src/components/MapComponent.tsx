// src/components/MapComponent.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import { MapMarkerPopup } from "./MapMarkerPopup";


const recifeCenter: [number, number] = [-8.0476, -34.877];
const recifeBounds: [[number, number], [number, number]] = [
  [-8.164, -34.976],
  [-7.903, -34.841],
];


interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  status: string;
  foto?: string;
}

interface PontoColeta {
  id: number;
  titulo: string;
  descricao: string;
  tipo_residuo: string;
  latitude: number;
  longitude: number;
  foto?: string;
}

interface MapaData {
  denuncias: Denuncia[];
  pontos: PontoColeta[];
}


interface MapComponentProps {
  selectedLocation?: { lat: number; lng: number } | null;
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

// Centralizar mapa na posição recebida do Dashboard

const FlyToSelected = ({ location }: { location?: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 17, { duration: 1.2 });
    }
  }, [location]);

  return null;
};

// Centralizar mapa na posição do usuário
const FlyToUser = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position, map]);
  return null;
};

const MapComponent = ({ selectedLocation }: MapComponentProps) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [dadosMapa, setDadosMapa] = useState<MapaData>({ denuncias: [], pontos: [] });

  // Buscar dados do backend
  useEffect(() => {
    async function carregarMapa() {
      try {
        const res = await api.get("/mapa");
        const data = res.data;

        const denuncias: Denuncia[] = data
          .filter((item: any) => item.tipo === "denuncia")
          .map((d: any, i: number) => {
            const fotoUrl = d.foto ? getImageUrl(d.foto) : undefined;
            return {
              id: d.id,
              titulo: d.titulo,
              descricao: d.descricao,
              latitude: d.latitude + i * 0.00005,
              longitude: d.longitude + i * 0.00005,
              status: d.status || "PENDENTE",
              foto: fotoUrl || undefined,
            };
          });

        const pontos: PontoColeta[] = data
          .filter((item: any) => item.tipo === "ponto")
          .map((p: any) => {
            const fotoUrl = p.foto ? getImageUrl(p.foto) : undefined;
            return {
              id: p.id,
              titulo: p.titulo,
              descricao: p.descricao,
              tipo_residuo: p.tipo_residuo || "",
              latitude: p.latitude,
              longitude: p.longitude,
              foto: fotoUrl || undefined,
            };
          });

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
      
      {selectedLocation && <FlyToSelected location={selectedLocation} />}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {dadosMapa.denuncias.map((denuncia) => {
        // Define a cor do marcador baseado no status
        const getMarkerColor = (status: string) => {
          const statusLower = status.toLowerCase();
          if (statusLower === "resolvida") return "#2563EB"; // Azul (resolvido/concluído)
          if (statusLower === "encaminhada") return "#FFA500"; // Laranja
          return "#FF2C2C"; // Vermelho (padrão para pendente/validada)
        };

        return (
          <Marker
            key={`den-${denuncia.id}`}
            position={[denuncia.latitude, denuncia.longitude]}
            icon={createColoredIcon(getMarkerColor(denuncia.status))}
          >
            <Popup>
              <MapMarkerPopup
                titulo={denuncia.titulo}
                descricao={denuncia.descricao}
                foto={denuncia.foto}
                status={denuncia.status}
              />
            </Popup>
          </Marker>
        );
      })}

      {dadosMapa.pontos.map((ponto) => (
        <Marker
          key={`ponto-${ponto.id}`}
          position={[ponto.latitude, ponto.longitude]}
          icon={createColoredIcon("#069240")}
        >
          <Popup>
            <MapMarkerPopup
              titulo={ponto.titulo}
              descricao={ponto.descricao}
              foto={ponto.foto}
              tipoResiduo={ponto.tipo_residuo}
            />
          </Popup>
        </Marker>
      ))}

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
