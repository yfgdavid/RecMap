// Componente de tela de carregamento com animação personalizada

import React from 'react';
import { RecMapLogo } from './RecMapLogo';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#DDEB9D] via-white to-[#A0C878] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo com animação de pulso suave */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#143D60]/10 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="relative animate-pulse" style={{ animationDuration: '2s' }}>
            <RecMapLogo size="xl" variant="light" />
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          {/* Círculo de carregamento girando - PRINCIPAL */}
          <div className="relative flex items-center justify-center">
            {/* Círculo externo grande girando */}
            <div 
              className="w-20 h-20 rounded-full border-4 border-transparent border-t-[#143D60] border-r-[#143D60]"
              style={{
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            {/* Círculo médio girando (sentido contrário) */}
            <div 
              className="absolute w-16 h-16 rounded-full border-4 border-transparent border-b-[#A0C878] border-l-[#A0C878]"
              style={{
                animation: 'spin 0.8s linear infinite reverse',
              }}
            ></div>
            {/* Círculo interno girando */}
            <div 
              className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-[#143D60] border-r-[#A0C878]"
              style={{
                animation: 'spin 0.6s linear infinite',
              }}
            ></div>
            {/* Spinner do lucide como backup */}
            <Loader2 className="absolute w-10 h-10 text-[#143D60] animate-spin" style={{ animationDuration: '1s' }} />
          </div>
          
          {/* Texto com animação */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-[#143D60] text-xl font-semibold">{message}</p>
            <p className="text-[#143D60]/70 text-sm">Por favor, aguarde...</p>
          </div>
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


