import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export function SafeImage({ src, alt, className = '', onError, onLoad }: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    setImageSrc(src);

    // Verifica se a imagem está acessível
    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = (error) => {
      console.error('Erro ao carregar imagem:', src, error);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('Não foi possível carregar a imagem');
      onError?.();
    };

    img.src = src;
  }, [src, onError, onLoad]);

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Sem imagem disponível</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600">{errorMessage || 'Erro ao carregar imagem'}</p>
          <p className="text-xs text-gray-500 mt-1 break-all">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={imageSrc || ''}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Erro ao exibir a imagem');
          onError?.();
        }}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
          onLoad?.();
        }}
      />
    </div>
  );
}

