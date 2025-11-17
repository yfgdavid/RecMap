import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Carregando...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 min-w-[200px]">
        <Loader2 className="w-8 h-8 text-[#143D60] animate-spin" />
        <p className="text-[#143D60] font-medium">{message}</p>
        <p className="text-gray-500 text-sm text-center">
          Sua conexão pode estar lenta. Aguarde...
        </p>
      </div>
    </div>
  );
}

