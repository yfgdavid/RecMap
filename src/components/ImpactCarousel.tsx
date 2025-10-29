import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ImpactData {
  id: number;
  icon: string;
  title: string;
  statistic: string;
  description: string;
  source: string;
  comment: string;
}

interface ImpactCarouselProps {
  data: ImpactData[];
  autoPlay?: boolean;
  interval?: number;
}

export function ImpactCarousel({ data, autoPlay = true, interval = 5000 }: ImpactCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, data.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? data.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === data.length - 1 ? 0 : currentIndex + 1);
  };

  const currentItem = data[currentIndex];

  return (
    <div className="relative">
      <Card className="border-2 border-[#A0C878] shadow-2xl bg-gradient-to-br from-white via-[#DDEB9D]/20 to-white backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={goToPrevious}
              className="p-2 rounded-full bg-[#143D60] text-white hover:bg-[#0F2F4A] transition-colors"
              aria-label="Dado anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center flex-1 mx-4">
              <div className="text-4xl mb-3">{currentItem.icon}</div>
              <h3 className="text-2xl font-bold text-[#143D60] mb-2">{currentItem.title}</h3>
              <div className="text-4xl font-bold text-[#143D60] mb-3">{currentItem.statistic}</div>
              <p className="text-gray-700 leading-relaxed mb-4">{currentItem.description}</p>
              
              {/* Comentário inflamante */}
              <div className="bg-[#143D60] text-white p-4 rounded-lg mb-4">
                <p className="font-medium italic">{currentItem.comment}</p>
              </div>
              
              <p className="text-sm text-gray-500">
                Fonte: {currentItem.source}
              </p>
            </div>
            
            <button 
              onClick={goToNext}
              className="p-2 rounded-full bg-[#143D60] text-white hover:bg-[#0F2F4A] transition-colors"
              aria-label="Próximo dado"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Indicadores */}
          <div className="flex justify-center space-x-2">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#A0C878]' : 'bg-gray-300'
                }`}
                aria-label={`Ir para o dado ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
