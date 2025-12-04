import React from 'react';
// Componente de loading para exibição durante carregamento de denúncias
interface DenunciaLoadingProps {
  message?: string;
}

export function DenunciaLoading({ message = 'Carregando denúncia...' }: DenunciaLoadingProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          minWidth: '280px',
          maxWidth: '90%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #143D60',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        ></div>
        
        {/* Texto principal */}
        <p
          style={{
            color: '#374151',
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            textAlign: 'center'
          }}
        >
          {message}
        </p>
        
        {/* Texto secundário */}
        <p
          style={{
            color: '#9CA3AF',
            fontSize: '14px',
            fontWeight: 400,
            margin: 0,
            textAlign: 'center'
          }}
        >
          Sua conexão pode estar lenta. Aguarde...
        </p>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

