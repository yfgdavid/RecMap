import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RecMapLogo } from '../RecMapLogo';
import { ArrowLeft, Users, FileText, Eye, EyeOff } from 'lucide-react';
import { UserType, AuthMode, User } from '../../App';

interface AuthFormProps {
  userType: UserType;
  authMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onBack: () => void;
  onLoginSuccess?: (user: User) => void; // ✅ recebe User
}

export function AuthForm({
  userType,
  authMode,
  onModeChange,
  onBack,
  onLoginSuccess = () => {}
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'register' && formData.password !== formData.confirmPassword) {
      alert('Senhas não coincidem!');
      return;
    }

    const payload = {
      nome: formData.name,
      email: formData.email,
      senha: formData.password,
      tipo_usuario: userType === 'government' ? 'GOVERNAMENTAL' : 'CIDADAO'
    };

    try {
      const url = authMode === 'register' ? '/auth/register' : '/auth/login';
      const res = await fetch(`https://recmap-backend-production.up.railway.app${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => {
        throw new Error('Resposta inválida do servidor');
      });

      if (!res.ok) {
        alert(data.message || 'Erro ao autenticar');
        return;
      }

      if (authMode === 'login') {
        // ✅ criar User a partir do retorno do backend
        const user: User = {
          id: data.user.id_usuario,
          name: data.user.nome,
          email: data.user.email,
          type: userType
        };

        localStorage.setItem('token', data.token); // guardar token
        onLoginSuccess?.(user);
        alert('Login realizado com sucesso!');
      } else {
        alert('Cadastro realizado com sucesso! Faça login.');
        onModeChange('login');
      }
    } catch (error) {
      console.error(error);
      alert('Erro na requisição: ' + error);
    }
  };

  const isGovernment = userType === 'government';
  const userTypeLabel = isGovernment ? 'Gestor Público' : 'Cidadão';
  const UserIcon = isGovernment ? FileText : Users;

  

  return (
<div className="min-h-screen bg-gradient-to-br from-[#DDEB9D] via-white to-[#A0C878] flex flex-col items-center justify-center p-4 space-y-8">

  {/* Logo centralizada */}
  <div className="flex justify-center w-full">
    <RecMapLogo size="2xl" variant="light" />
  </div>

  {/* Formulário centralizado com largura responsiva */}
  <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
    <Card className="w-full shadow-xl border-2 border-[#A0C878]">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isGovernment ? 'bg-[#143D60]' : 'bg-[#A0C878]'
        }`}>
          <UserIcon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-[#143D60]">
          {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
        </CardTitle>
        <CardDescription className="text-lg">
          Acesso para {userTypeLabel}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="border-[#A0C878] focus:border-[#143D60]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder={isGovernment ? "seu.email@prefeitura.gov.br" : "seu.email@exemplo.com"}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="border-[#A0C878] focus:border-[#143D60]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="border-[#A0C878] focus:border-[#143D60] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0C878] hover:text-[#143D60] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A0C878] rounded p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="border-[#A0C878] focus:border-[#143D60] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0C878] hover:text-[#143D60] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A0C878] rounded p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full text-white ${
              isGovernment ? 'bg-[#143D60] hover:bg-[#0F2F4A]' : 'bg-[#A0C878] hover:bg-[#8BB668]'
            }`}
          >
            {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          </p>
          <Button
            variant="link"
            onClick={() => onModeChange(authMode === 'login' ? 'register' : 'login')}
            className="text-[#143D60] hover:text-[#A0C878] p-0"
          >
            {authMode === 'login' ? 'Cadastre-se aqui' : 'Faça login aqui'}
          </Button>
        </div>

        {isGovernment && (
          <div className="mt-4 p-3 bg-[#DDEB9D] rounded-lg">
            <p className="text-sm text-[#143D60]">
              <strong>Acesso Governamental:</strong> Este acesso é destinado a gestores públicos e órgãos ambientais.
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    <div className="mt-6 text-center">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-[#143D60] hover:bg-[#143D60] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>
    </div>
  </div>
</div>

  );
}
