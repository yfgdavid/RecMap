import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Carregando...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-6 min-w-[280px]">
        {/* Círculo de carregamento girando - PRINCIPAL */}
        <div className="relative flex items-center justify-center">
          {/* Círculo externo girando */}
          <div 
            className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#143D60] border-r-[#143D60]"
            style={{
              animation: 'spin 1s linear infinite',
            }}
          ></div>
          {/* Círculo interno girando (sentido contrário) */}
          <div 
            className="absolute w-12 h-12 rounded-full border-4 border-transparent border-b-[#A0C878] border-l-[#A0C878]"
            style={{
              animation: 'spin 0.8s linear infinite reverse',
            }}
          ></div>
          {/* Spinner do lucide como backup */}
          <Loader2 className="absolute w-8 h-8 text-[#143D60] animate-spin" style={{ animationDuration: '1s' }} />
        </div>
        
        {/* Mensagem principal */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-[#143D60] font-semibold text-lg">{message}</p>
          <p className="text-gray-500 text-sm text-center">
            Sua conexão pode estar lenta. Aguarde...
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

