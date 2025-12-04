import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";

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
  endereco?: string;
}

interface PontoColeta {
  id: number;
  titulo: string;
  descricao: string;
  tipo_residuo: string;
  latitude: number;
  longitude: number;
  foto?: string;
  endereco?: string;
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

// Função para fazer reverse geocoding (lat/lng → endereço)
const obterEndereco = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    // Extrair endereço formatado
    const endereco = data.address;
    const rua = endereco.road || endereco.street || "";
    const numero = endereco.house_number || "";
    const bairro = endereco.neighbourhood || endereco.suburb || "";
    const cidade = endereco.city || endereco.town || "Recife";
    
    // Montar string de endereço
    let enderecoFormatado = "";
    if (rua) enderecoFormatado += rua;
    if (numero) enderecoFormatado += `, ${numero}`;
    if (bairro) enderecoFormatado += ` - ${bairro}`;
    enderecoFormatado += `, ${cidade}`;
    
    return enderecoFormatado || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Erro ao obter endereço:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

// Centralizar mapa na posição recebida
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

// Componente do Popup para Denúncia
const DenunciaPopup = ({ denuncia }: { denuncia: Denuncia }) => {
  const [endereco, setEndereco] = useState<string>("Carregando endereço...");
  const [mostrarEndereco, setMostrarEndereco] = useState(false);

  useEffect(() => {
    if (!denuncia.endereco && !mostrarEndereco) return;
    
    if (denuncia.endereco) {
      setEndereco(denuncia.endereco);
    } else {
      obterEndereco(denuncia.latitude, denuncia.longitude).then((end) => {
        setEndereco(end);
      });
    }
  }, [mostrarEndereco, denuncia.endereco, denuncia.latitude, denuncia.longitude]);

  return (
    <div className="w-64 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {denuncia.foto && (
        <div className="w-full aspect-[4/3] overflow-hidden">
          <img
            src={denuncia.foto}
            alt={denuncia.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm text-[#143D60] leading-tight">
            {denuncia.titulo}
          </h3>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            {denuncia.descricao}
          </p>
        </div>

        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-md
            ${
              denuncia.status.toLowerCase() === "encaminhada"
                ? "bg-orange-100 text-orange-700"
                : denuncia.status.toLowerCase() === "resolvida"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {denuncia.status}
        </span>

        {/* Botão para mostrar localização */}
        <button
          onClick={() => setMostrarEndereco(!mostrarEndereco)}
          className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-[#143D60] font-semibold py-2 px-3 rounded-lg transition text-xs flex items-center justify-center gap-2"
        >
           {mostrarEndereco ? "Ocultar Localização" : "Ver Localização"}
        </button>

        {/* Mostrar endereço quando botão clicado */}
        {mostrarEndereco && (
          <div className="bg-[#DDEB9D] bg-opacity-30 border border-[#A0C878] rounded-lg p-2 text-xs text-[#143D60] font-medium">
            <p className="break-words">{endereco}</p>
            <p className="text-[10px] text-gray-600 mt-1">
              Lat: {denuncia.latitude.toFixed(4)}, Lng: {denuncia.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente do Popup para Ponto de Coleta
const PontoPopup = ({ ponto }: { ponto: PontoColeta }) => {
  const [endereco, setEndereco] = useState<string>("Carregando endereço...");
  const [mostrarEndereco, setMostrarEndereco] = useState(false);

  useEffect(() => {
    if (!ponto.endereco && !mostrarEndereco) return;
    
    if (ponto.endereco) {
      setEndereco(ponto.endereco);
    } else {
      obterEndereco(ponto.latitude, ponto.longitude).then((end) => {
        setEndereco(end);
      });
    }
  }, [mostrarEndereco, ponto.endereco, ponto.latitude, ponto.longitude]);

  return (
    <div className="w-64 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {ponto.foto && (
        <div className="w-full aspect-[4/3] overflow-hidden">
          <img
            src={ponto.foto}
            alt={ponto.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm text-[#143D60] leading-tight">
            {ponto.titulo}
          </h3>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            {ponto.descricao}
          </p>
        </div>

        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700">
          {ponto.tipo_residuo}
        </span>

        {/* Botão para mostrar localização */}
        <button
          onClick={() => setMostrarEndereco(!mostrarEndereco)}
          className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-[#143D60] font-semibold py-2 px-3 rounded-lg transition text-xs flex items-center justify-center gap-2"
        >
           {mostrarEndereco ? "Ocultar Localização" : "Ver Localização"}
        </button>

        {/* Mostrar endereço quando botão clicado */}
        {mostrarEndereco && (
          <div className="bg-[#DDEB9D] bg-opacity-30 border border-[#A0C878] rounded-lg p-2 text-xs text-[#143D60] font-medium">
            <p className="break-words">{endereco}</p>
            <p className="text-[10px] text-gray-600 mt-1">
              Lat: {ponto.latitude.toFixed(4)}, Lng: {ponto.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
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
          .map((d: any, i: number) => ({
            id: d.id,
            titulo: d.titulo,
            descricao: d.descricao,
            latitude: d.latitude + i * 0.00005,
            longitude: d.longitude + i * 0.00005,
            status: d.status || "PENDENTE",
            foto: d.foto || undefined,
            endereco: d.endereco || undefined,
          }));

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
            endereco: p.endereco || undefined,
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
      {selectedLocation && <FlyToSelected location={selectedLocation} />}

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
            denuncia.status.toLowerCase() === "resolvida" ? "#3B82F6" :
            denuncia.status.toLowerCase() === "encaminhada" ? "#FFA500" : "#FF2C2C"
            
          )}
        >
          <Popup>
            <DenunciaPopup denuncia={denuncia} />
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
            <PontoPopup ponto={ponto} />
          </Popup>
        </Marker>
      ))}

      {/* Marcador de Localização do Usuário */}
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
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-[#143D60]">Você está aqui</p>
                <p className="text-xs text-gray-600">
                  {userPosition[0].toFixed(4)}, {userPosition[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;