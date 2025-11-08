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
  onLoginSuccess?: (user: User) => void;
  resetToken?: string; // usado no reset de senha
}

export function AuthForm({
  userType,
  authMode,
  onModeChange,
  onBack,
  onLoginSuccess = () => {},
  resetToken
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (authMode === 'forgot') {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Erro ao enviar recuperação');
          return;
        }
        setSuccess('E-mail de recuperação enviado!');
        return;
      }

      if (authMode === 'reset') {
        if (formData.password !== formData.confirmPassword) {
          setError('Senhas não coincidem!');
          return;
        }
        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: resetToken,
            novaSenha: formData.password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Erro ao redefinir senha');
          return;
        }
        setSuccess('Senha redefinida com sucesso! Faça login.');
        onModeChange('login');
        return;
      }

      // login / register
      if (authMode === 'register' && formData.password !== formData.confirmPassword) {
        setError('Senhas não coincidem!');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      const isGovEmail = formData.email.toLowerCase().endsWith('.gov.br');
      if (userType === 'government' && !isGovEmail) {
        setError('Para acessar como Gestor Público, use um e-mail institucional (.gov.br).');
        return;
      }
      if (userType === 'citizen' && isGovEmail) {
        setError('E-mails institucionais (.gov.br) só podem ser usados no acesso de Gestor Público.');
        return;
      }

      const payload = {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        tipo_usuario: userType === 'government' ? 'GOVERNAMENTAL' : 'CIDADAO'
      };

      const url = authMode === 'register' ? '/auth/register' : '/auth/login';
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erro ao autenticar');
        return;
      }

      if (authMode === 'login') {
        const user: User = {
          id: data.user.id_usuario,
          name: data.user.nome,
          email: data.user.email,
          type: userType
        };
        localStorage.setItem('token', data.token);
        onLoginSuccess?.(user);
        setSuccess('Login realizado com sucesso!');
      } else {
        setSuccess('Cadastro realizado com sucesso! Faça login.');
        onModeChange('login');
      }

    } catch (err: any) {
      console.error(err);
      setError('Erro na requisição: ' + err.message);
    }
  };

  const isGovernment = userType === 'government';
  const UserIcon = isGovernment ? FileText : Users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DDEB9D] via-white to-[#A0C878] flex flex-col items-center justify-center p-4 space-y-8">
      <div className="flex justify-center w-full">
        <RecMapLogo size="2xl" variant="light" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <Card className="w-full shadow-xl border-2 border-[#A0C878]">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isGovernment ? 'bg-[#143D60]' : 'bg-[#A0C878]'}`}>
              <UserIcon className="w-8 h-8 text-white" />
            </div>

            <CardTitle className="text-2xl text-[#143D60]">
              {authMode === 'login' && 'Entrar'}
              {authMode === 'register' && 'Cadastrar'}
              {authMode === 'forgot' && 'Recuperar Senha'}
              {authMode === 'reset' && 'Redefinir Senha'}
            </CardTitle>

            <CardDescription className="text-lg">
              {authMode === 'forgot' && "Enviaremos um link para seu e-mail"}
              {authMode === 'reset' && "Digite sua nova senha"}
              {(authMode === 'login' || authMode === 'register') && `Acesso para ${isGovernment ? 'Gestor Público' : 'Cidadão'}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Forgot */}
              {authMode === 'forgot' && (
                <>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-[#143D60] text-white hover:bg-[#0F2F4A]">
                    Enviar link de recuperação
                  </Button>
                  <Button variant="link" className="text-[#143D60]" onClick={() => onModeChange('login')}>
                    Voltar ao login
                  </Button>
                </>
              )}

              {/* Reset */}
              {authMode === 'reset' && (
                <>
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-[#143D60] text-white hover:bg-[#0F2F4A]">
                    Redefinir Senha
                  </Button>
                </>
              )}

              {/* Login / Register */}
              {(authMode === 'login' || authMode === 'register') && (
                <>
                  {authMode === 'register' && (
                    <>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </>
                  )}

                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={isGovernment ? "seu.email@prefeitura.gov.br" : "seu.email@exemplo.com"}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />

                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {authMode === 'register' && (
                    <>
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className={`w-full text-white ${isGovernment ? 'bg-[#143D60] hover:bg-[#0F2F4A]' : 'bg-[#A0C878] hover:bg-[#8BB668]'}`}
                  >
                    {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
                  </Button>
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
                  {authMode === 'login' && (
                    <Button variant="link" onClick={() => onModeChange('forgot')} className="text-[#143D60] mt-2">
                      Esqueci minha senha
                    </Button>

                    
                  )}
                </>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={onBack} className="text-[#143D60] hover:bg-[#143D60] hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
