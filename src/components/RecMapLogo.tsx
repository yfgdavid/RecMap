import React from 'react';
import logoDark from 'figma:asset/d034c51a4e20b0eb04a51662e3df963e95be5ff9.png';
import logoLight from 'figma:asset/a5cfd4c610c77d4585f792b2f83ee6531d12839e.png';

interface RecMapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function RecMapLogo({ size = 'md', className = '', variant = 'auto' }: RecMapLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    '2xl': 'w-40 h-40'
  };

  // Para variante 'auto', usamos logo escuro em backgrounds claros e vice-versa
  // Para headers azuis escuros (#143D60), usamos a logo clara (branca com verde)
  const logoSrc = variant === 'dark' ? logoLight : variant === 'light' ? logoDark : logoDark;

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Rec'Map" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
