import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ImageWithThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithThumbnail({ 
  src, 
  alt, 
  className = '' 
}: ImageWithThumbnailProps) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);

  if (!src) return null;

  return (
    <>
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={() => setShowFullImage(true)}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover rounded transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-50'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            imageRendering: 'auto',
            filter: 'blur(1px) contrast(0.9) brightness(0.95)',
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded transition-opacity">
            Clique para ampliar
          </span>
        </div>
      </div>

      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>{alt}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowFullImage(false);
                  setFullImageLoaded(false);
                }}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4 flex items-center justify-center bg-gray-100 min-h-[400px] relative">
            {!fullImageLoaded && (
              <div className="absolute">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
            <img
              src={src}
              alt={alt}
              className={`max-w-full max-h-[70vh] object-contain rounded transition-opacity ${fullImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setFullImageLoaded(true)}
              loading="eager"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
