import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';

export type UserType = 'citizen' | 'government' | null;
export type AuthMode = 'login' | 'register';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    setAuthMode('login');
  };

  const handleCreateAccount = (type: UserType) => {
    setSelectedUserType(type);
    setAuthMode('register');
  };

  const handleAuth = (userData: { name: string; email: string; password: string }) => {
    // Simular autenticação
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      type: selectedUserType!
    };
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUserType(null);
    setAuthMode('login');
  };

  const handleBackToLanding = () => {
    setSelectedUserType(null);
    setAuthMode('login');
  };

  // Se não há usuário logado e nenhum tipo selecionado, mostra landing
  if (!currentUser && !selectedUserType) {
    return <Landing onUserTypeSelect={handleUserTypeSelect} onCreateAccount={handleCreateAccount} />;
  }

  // Se tipo foi selecionado mas não há usuário logado, mostra formulário de auth
  if (!currentUser && selectedUserType) {
    return (
      <AuthForm
        userType={selectedUserType}
        authMode={authMode}
        onAuth={handleAuth}
        onModeChange={setAuthMode}
        onBack={handleBackToLanding}
      />
    );
  }

  // Se há usuário logado, mostra dashboard apropriado
  if (currentUser?.type === 'government') {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  } else {
    return <CitizenDashboard user={currentUser} onLogout={handleLogout} />;
  }
}