// import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
// import { setLoadingCallbacks } from '../services/api';
// import { registerLoadingCallbacks } from '../utils/fetchWithLoading';

// interface LoadingContextType {
//   isLoading: boolean;
//   setLoading: (loading: boolean) => void;
//   loadingMessage: string;
//   setLoadingMessage: (message: string) => void;
// }

// const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// export function LoadingProvider({ children }: { children: React.ReactNode }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Carregando...');
//   const callbacksRef = useRef({ setLoading: null, setLoadingMessage: null });

//   const setLoading = useCallback((loading: boolean) => {
//     setIsLoading(loading);
//     if (!loading) {
//       // Limpa a mensagem quando para de carregar
//       setTimeout(() => setLoadingMessage('Carregando...'), 300);
//     }
//   }, []);

//   const setLoadingMessageCallback = useCallback((message: string) => {
//     setLoadingMessage(message);
//   }, []);

//   // Registra os callbacks no api.js e fetchWithLoading quando o componente monta
//   useEffect(() => {
//     callbacksRef.current = {
//       setLoading,
//       setLoadingMessage: setLoadingMessageCallback
//     };
//     setLoadingCallbacks([callbacksRef.current]);
//     registerLoadingCallbacks([callbacksRef.current]);
//   }, [setLoading, setLoadingMessageCallback]);

//   return (
//     <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
//       {children}
//     </LoadingContext.Provider>
//   );
// }

// export function useLoading() {
//   const context = useContext(LoadingContext);
//   if (!context) {
//     throw new Error('useLoading deve ser usado dentro de LoadingProvider');
//   }
//   return context;
// }
