import React from 'react';
import { RecMapLogo } from './RecMapLogo';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#DDEB9D] via-white to-[#A0C878] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <RecMapLogo size="xl" variant="light" />
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#143D60] animate-spin" />
          <p className="text-[#143D60] text-lg font-medium">{message}</p>
          <p className="text-[#143D60]/70 text-sm">Por favor, aguarde...</p>
        </div>
      </div>
    </div>
  );
}

