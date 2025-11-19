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

  // Simula carregamento inicial da aplicação
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

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
  };

  const handleBackToLanding = () => {
    setSelectedUserType(null);
    setAuthMode('login');
  };

  // Mostra tela de loading durante carregamento inicial
  if (isInitialLoading) {
    return <LoadingScreen message="Carregando aplicação..." />;
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
          onLoginSuccess={setCurrentUser}
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
