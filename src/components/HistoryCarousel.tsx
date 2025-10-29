import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface HistoryData {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HistoryCarouselProps {
  data: HistoryData[];
  autoPlay?: boolean;
  interval?: number;
}

export function HistoryCarousel({ data, autoPlay = true, interval = 4000 }: HistoryCarouselProps) {
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
      <Card className="border-2 border-[#A0C878] shadow-xl bg-gradient-to-br from-white to-[#DDEB9D]/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={goToPrevious}
              className="p-2 rounded-full bg-[#143D60] text-white hover:bg-[#0F2F4A] transition-colors"
              aria-label="Período anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="text-center flex-1 mx-4">
              <div className="text-3xl mb-2">{currentItem.icon}</div>
              <div className="text-2xl font-bold mb-2 text-[#143D60]">
                {currentItem.year}
              </div>
              <h4 className="text-lg font-semibold text-[#143D60] mb-3">{currentItem.title}</h4>
              <p className="text-gray-700 leading-relaxed text-sm">{currentItem.description}</p>
            </div>
            
            <button 
              onClick={goToNext}
              className="p-2 rounded-full bg-[#143D60] text-white hover:bg-[#0F2F4A] transition-colors"
              aria-label="Próximo período"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Indicadores */}
          <div className="flex justify-center space-x-2 mt-4">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#A0C878]' : 'bg-gray-300'
                }`}
                aria-label={`Ir para o período ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}