import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ImageLightboxProps {
  imageUrl: string | null | undefined;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ imageUrl, alt, isOpen, onClose }: ImageLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [isOpen, imageUrl]);

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0 max-h-[90vh] overflow-hidden">
        {/* DialogTitle e DialogDescription ocultos para acessibilidade */}
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Imagem em tamanho completo: {alt}
        </DialogDescription>
        
        <div className="relative bg-black/95">
          {/* Header com botão de fechar */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Container da imagem */}
          <div className="flex items-center justify-center min-h-[400px] max-h-[85vh] p-4 relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}

            {imageError && (
              <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
                <p className="text-white font-semibold">Erro ao carregar imagem</p>
                <p className="text-gray-400 text-sm">{imageUrl}</p>
              </div>
            )}

            {!imageError && (
              <img
                src={imageUrl}
                alt={alt}
                className={`max-w-full max-h-[85vh] object-contain rounded transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
                loading="eager"
              />
            )}
          </div>

          {/* Footer com informações */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-medium text-center">{alt}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

