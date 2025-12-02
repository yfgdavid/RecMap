import React from 'react';

interface MapMarkerPopupProps {
  titulo: string;
  descricao: string;
  foto?: string | null;
  status?: string;
  tipoResiduo?: string;
  statusColor?: string;
}

export function MapMarkerPopup({
  titulo,
  descricao,
  foto,
  status,
  tipoResiduo,
  statusColor,
}: MapMarkerPopupProps) {
  return (
    <div className="w-44 rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Imagem da foto - tamanho maior como antes */}
      {foto && (
        <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-lg">
          <img
            src={foto}
            alt={titulo}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', foto);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('Imagem carregada com sucesso:', foto);
            }}
          />
        </div>
      )}

      {/* Conteúdo do popup */}
      <div className="p-2 space-y-1">
        <h3 className="font-semibold text-[#143D60] text-sm leading-tight">{titulo}</h3>
        <p className="text-xs text-gray-600 leading-snug line-clamp-2">{descricao}</p>

        {/* Badge de status ou tipo */}
        {status && (
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${
              status.toLowerCase() === 'resolvida'
                ? 'bg-blue-100 text-blue-700'
                : status.toLowerCase() === 'encaminhada'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {status}
          </span>
        )}

        {tipoResiduo && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-green-100 text-green-700">
            {tipoResiduo}
          </span>
        )}
      </div>
    </div>
  );
}

