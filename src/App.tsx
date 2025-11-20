import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { Toaster } from './components/ui/sonner';

export type UserType = 'citizen' | 'government' | null;
export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Restaura sessão do localStorage ao carregar a página
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
          try {
            // Valida o token e atualiza os dados do usuário do backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/auth/validate`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.user) {
                // Usa os dados atualizados do backend
                const userData = data.user;
                const user: User = {
                  id: String(userData.id_usuario || userData.id),
                  name: userData.nome || userData.name,
                  email: userData.email,
                  type: userData.tipo || (userData.tipo_usuario === 'GOVERNAMENTAL' ? 'government' : 'citizen')
                };
                // Atualiza o localStorage com os dados corretos
                localStorage.setItem('user', JSON.stringify(user));
                setCurrentUser(user);
              } else {
                // Se não conseguir validar, usa os dados salvos
                const user: User = JSON.parse(savedUser);
                setCurrentUser(user);
              }
            } else {
              // Token inválido, limpa e usa dados salvos
              const user: User = JSON.parse(savedUser);
              setCurrentUser(user);
            }
          } catch (error) {
            console.error('Erro ao validar sessão:', error);
            // Em caso de erro, tenta usar os dados salvos
            try {
              const user: User = JSON.parse(savedUser);
              setCurrentUser(user);
            } catch (parseError) {
              // Se não conseguir, limpa tudo
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      }
    };

    restoreSession();
  }, []);

  // Detecta token de reset na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken');
    if (token) {
      setResetToken(token);
      setAuthMode('reset');
      setSelectedUserType('citizen'); // ou 'government' se quiser permitir
    }
  }, []);

  // Tela de loading inicial ao recarregar a página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    setAuthMode('login');
  };

  const handleCreateAccount = (type: UserType) => {
    setSelectedUserType(type);
    setAuthMode('register');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUserType(null);
    setAuthMode('login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Função para atualizar o usuário e salvar no localStorage
  const handleUserUpdate = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleBackToLanding = () => {
    setSelectedUserType(null);
    setAuthMode('login');
  };

  // Mostra tela de loading durante carregamento inicial
  if (isInitialLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom right, #DDEB9D, white, #A0C878)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #143D60',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#143D60', fontSize: '18px', fontWeight: 500 }}>Carregando aplicação...</p>
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

  // Mostra landing se nenhum usuário selecionado e não logado
  if (!currentUser && !selectedUserType) {
    return (
      <>
        <Landing onUserTypeSelect={handleUserTypeSelect} onCreateAccount={handleCreateAccount} />
        <Toaster />
      </>
    );
  }

  // Formulário de autenticação
  if (!currentUser && selectedUserType) {
    return (
      <>
        <AuthForm
          userType={selectedUserType}
          authMode={authMode}
          onLoginSuccess={handleUserUpdate}
          onModeChange={setAuthMode}
          onBack={handleBackToLanding}
          resetToken={resetToken || undefined}
        />
        <Toaster />
      </>
    );
  }

  // Dashboard
  if (currentUser) {
    if (currentUser.type === 'government') {
      return (
        <>
          <Dashboard user={currentUser} onLogout={handleLogout} />
          <Toaster />
        </>
      );
    } else {
      return (
        <>
          <CitizenDashboard user={currentUser} onLogout={handleLogout} />
          <Toaster />
        </>
      );
    }
  }

  return <LoadingScreen message="Carregando..." />;
}

export default function App() {
  return <AppContent />;
  // return (
  //   <LoadingProvider>
  //     <AppContent />
  //   </LoadingProvider>
  // );
  }
