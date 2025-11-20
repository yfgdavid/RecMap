import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { RecMapLogo } from '../RecMapLogo';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  FileText, MapPin, Users, TrendingUp, Download,
  AlertTriangle, CheckCircle, Clock, Leaf, LogOut, MoreVertical, Send
} from 'lucide-react';
import { User } from '../../App';
import api from '../../services/api';
import { LoadingScreen } from '../LoadingScreen';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface DashboardData {
  cards: {
    totalDenuncias: { valor: number; variacao: string; periodo: string; tendencia: string };
    denunciasResolvidas: { valor: number; taxa: string; tendencia: string };
    usuariosAtivos: { valor: number; variacao: string; periodo: string; tendencia: string };
    pontosColeta: { valor: number; novos: string; tendencia: string };
  };
  graficos: {
    evolucaoMensal: Array<{ mes: string; total: number; resolvidas: number }>;
    distribuicaoTipos: Array<{ tipo: string; porcentagem: number; quantidade: number }>;
  };
  recentes: {
    denuncias: Array<{
      id: number;
      titulo: string;
      descricao: string;
      status: string;
      localizacao: string;
      data_criacao: string;
      usuario: string;
      total_validacoes: number;
      foto: string | null;
    }>;
    pontosColeta: Array<{
      id: number;
      titulo: string;
      descricao: string;
      localizacao: string;
      data_criacao: string;
      usuario: string;
      foto: string | null;
    }>;
  };
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do dashboard da API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const id_usuario = user.id;

        const response = await api.get<{ success: boolean; data?: DashboardData; message?: string }>('/governamental/dashboard', {
          params: { id_usuario },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.data.success && response.data.data) {
          setDashboardData(response.data.data);
        } else {
          setError(response.data.message || 'Erro ao carregar dados do dashboard');
        }
      } catch (err: any) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError(err.response?.data?.message || 'Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  // Mapear denúncias recentes para o formato esperado
  const reports = dashboardData?.recentes.denuncias.map(d => ({
    id: d.id,
    titulo: d.titulo,
    regiao: d.localizacao || 'Não especificado',
    status: d.status.toLowerCase(),
    data: new Date(d.data_criacao).toLocaleDateString('pt-BR')
  })) || [];

  // Mapear dados de evolução mensal para o formato esperado
  const reportsData = dashboardData?.graficos.evolucaoMensal.map(d => ({
    month: d.mes,
    denuncias: d.total,
    resolvidas: d.resolvidas
  })) || [];

  // Mapear dados de tipos de resíduos para o formato esperado
  const wasteTypesData = dashboardData?.graficos.distribuicaoTipos.map((d, index) => {
    const colors = ['#A0C878', '#DDEB9D', '#8BB668', '#143D60'];
    return {
      name: d.tipo,
      value: d.porcentagem,
      color: colors[index % colors.length]
    };
  }) || [];

  // Dados de região (pode ser calculado baseado nas denúncias reais)
  const regionData = dashboardData?.recentes.denuncias.reduce((acc, d) => {
    const regiao = d.localizacao || 'Não especificado';
    const existing = acc.find(r => r.regiao === regiao);
    if (existing) {
      existing.denuncias++;
    } else {
      acc.push({ regiao, denuncias: 1, status: 'Médio' });
    }
    return acc;
  }, [] as Array<{ regiao: string; denuncias: number; status: string }>).map(r => ({
    ...r,
    status: r.denuncias > 10 ? 'Alto' : r.denuncias > 5 ? 'Médio' : 'Baixo'
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'validada': return 'bg-blue-500';
      case 'encaminhada': return 'bg-orange-500';
      case 'resolvida': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return Clock;
      case 'validada': return CheckCircle;
      case 'encaminhada': return TrendingUp;
      case 'resolvida': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const handleForwardReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch<{ success: boolean; message?: string }>(`/governamental/denuncias/${reportId}/status`, 
        { status: 'ENCAMINHADA' },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (response.data.success) {
        // Recarregar dados do dashboard
        const dashboardResponse = await api.get<{ success: boolean; data?: DashboardData; message?: string }>('/governamental/dashboard', {
          params: { id_usuario: user.id },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (dashboardResponse.data.success && dashboardResponse.data.data) {
          setDashboardData(dashboardResponse.data.data);
        }
      }
    } catch (err: any) {
      console.error('Erro ao encaminhar denúncia:', err);
      alert(err.response?.data?.message || 'Erro ao encaminhar denúncia');
    }
  };

  const handleResolveReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch<{ success: boolean; message?: string }>(`/governamental/denuncias/${reportId}/status`, 
        { status: 'RESOLVIDA' },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (response.data.success) {
        // Recarregar dados do dashboard
        const dashboardResponse = await api.get<{ success: boolean; data?: DashboardData; message?: string }>('/governamental/dashboard', {
          params: { id_usuario: user.id },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (dashboardResponse.data.success && dashboardResponse.data.data) {
          setDashboardData(dashboardResponse.data.data);
        }
      }
    } catch (err: any) {
      console.error('Erro ao resolver denúncia:', err);
      alert(err.response?.data?.message || 'Erro ao marcar denúncia como resolvida');
    }
  };

  const handleDownloadReport = async () => {
    try {
      // Faz a requisição para o backend Node
      const response = await fetch("http://localhost:3333/relatorios/infografico", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar o PDF");
      }

      // Converte a resposta binária em um blob
      const blob = await response.blob();

      // Cria um link temporário para baixar o PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_recmap.pdf"; // nome do arquivo
      document.body.appendChild(a);
      a.click();

      // Remove o link temporário
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o relatório:", error);
    }
  };

  if (loading) {
    return <LoadingScreen message="Carregando dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header com botão de sair */}
        <header className="bg-[#143D60] text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RecMapLogo size="xl" variant="dark" />
                <div>
                  <p className="text-[#A0C878]">Bem-vindo, {user.name}</p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                className="bg-[#143D60] text-white hover:bg-[#0F2F4A] border-[#143D60]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo de erro */}
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Erro ao carregar dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{error}</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-[#143D60] hover:bg-[#0F2F4A] text-white"
                >
                  Tentar novamente
                </Button>
                <Button 
                  onClick={onLogout}
                  variant="outline"
                  className="w-full border-[#143D60] text-[#143D60] hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair e voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header com botão de sair */}
        <header className="bg-[#143D60] text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RecMapLogo size="xl" variant="dark" />
                <div>
                  <p className="text-[#A0C878]">Bem-vindo, {user.name}</p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                className="bg-[#143D60] text-white hover:bg-[#0F2F4A] border-[#143D60]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo sem dados */}
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Nenhum dado disponível</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Não há dados para exibir no momento.</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-[#143D60] hover:bg-[#0F2F4A] text-white"
                >
                  Recarregar página
                </Button>
                <Button 
                  onClick={onLogout}
                  variant="outline"
                  className="w-full border-[#143D60] text-[#143D60] hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair e voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#143D60] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RecMapLogo size="xl" variant="dark" />
              <div>
                <p className="text-[#A0C878]">Bem-vindo, {user.name}</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              className="bg-[#143D60] text-white hover:bg-[#0F2F4A] border-[#143D60]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#143D60] data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#143D60] data-[state=active]:text-white">
              Denúncias
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#143D60] data-[state=active]:text-white">
              Análises
            </TabsTrigger>
            <TabsTrigger value="exports" className="data-[state=active]:bg-[#143D60] data-[state=active]:text-white">
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#A0C878]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Denúncias</p>
                      <p className="text-2xl font-bold text-[#143D60]">{dashboardData.cards.totalDenuncias.valor.toLocaleString('pt-BR')}</p>
                      <p className={`text-xs ${dashboardData.cards.totalDenuncias.tendencia === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {dashboardData.cards.totalDenuncias.variacao} {dashboardData.cards.totalDenuncias.periodo}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-[#A0C878]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#DDEB9D]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Denúncias Resolvidas</p>
                      <p className="text-2xl font-bold text-[#143D60]">{dashboardData.cards.denunciasResolvidas.valor.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-green-600">{dashboardData.cards.denunciasResolvidas.taxa}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-[#A0C878]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#8BB668]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Usuários Ativos</p>
                      <p className="text-2xl font-bold text-[#143D60]">{dashboardData.cards.usuariosAtivos.valor.toLocaleString('pt-BR')}</p>
                      <p className={`text-xs ${dashboardData.cards.usuariosAtivos.tendencia === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {dashboardData.cards.usuariosAtivos.variacao} {dashboardData.cards.usuariosAtivos.periodo}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-[#143D60]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#143D60]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pontos de Coleta</p>
                      <p className="text-2xl font-bold text-[#143D60]">{dashboardData.cards.pontosColeta.valor.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-blue-600">{dashboardData.cards.pontosColeta.novos}</p>
                    </div>
                    <MapPin className="w-8 h-8 text-[#A0C878]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#143D60]">Denúncias por Mês</CardTitle>
                  <CardDescription>Evolução das denúncias e resoluções</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="denuncias" fill="#143D60" name="Denúncias" />
                      <Bar dataKey="resolvidas" fill="#A0C878" name="Resolvidas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#143D60]">Tipos de Resíduos</CardTitle>
                  <CardDescription>Distribuição das denúncias por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Gráfico de Pizza Responsivo */}
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={280} className="hidden md:block">
                      <PieChart>
                        <Pie
                          data={wasteTypesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={{ stroke: '#A0C878', strokeWidth: 1 }}
                        >
                          {wasteTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Versão Mobile - Gráfico Menor */}
                    <ResponsiveContainer width="100%" height={240} className="md:hidden">
                      <PieChart>
                        <Pie
                          data={wasteTypesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          dataKey="value"
                        >
                          {wasteTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Legenda Customizada Responsiva */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                      {wasteTypesData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[#A0C878] truncate">{item.name}</span>
                            <span className="text-xs text-gray-600">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Denúncias */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Denúncias Recentes</CardTitle>
                <CardDescription>Últimas denúncias registradas na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => {
                    const StatusIcon = getStatusIcon(report.status);
                    const canTakeAction = report.status !== 'resolvida';

                    return (
                      <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <StatusIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-[#143D60]">{report.titulo}</h4>
                            <p className="text-sm text-gray-600">{report.regiao} • {report.data}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`${getStatusColor(report.status)} text-white`}>
                            {report.status}
                          </Badge>
                          {canTakeAction && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#A0C878] text-[#143D60] hover:bg-[#A0C878] hover:text-white"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                {(report.status === 'pendente' || report.status === 'validada') && (
                                  <DropdownMenuItem
                                    onClick={() => handleForwardReport(report.id)}
                                    className="cursor-pointer"
                                  >
                                    <Send className="w-4 h-4 mr-2 text-orange-500" />
                                    <span>Encaminhar</span>
                                  </DropdownMenuItem>
                                )}
                                {report.status === 'encaminhada' && (
                                  <DropdownMenuItem
                                    onClick={() => handleResolveReport(report.id)}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    <span>Marcar como Resolvida</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Denúncias por Região</CardTitle>
                <CardDescription>Concentração de problemas ambientais por área</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#143D60]" />
                        <span className="font-medium">{region.regiao}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{region.denuncias} denúncias</span>
                        <Badge
                          variant={region.status === 'Alto' ? 'destructive' : region.status === 'Médio' ? 'secondary' : 'default'}
                        >
                          {region.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Análises */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Tendência de Resolução</CardTitle>
                <CardDescription>Taxa de resolução de denúncias ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={reportsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="resolvidas"
                      stroke="#A0C878"
                      strokeWidth={3}
                      name="Denúncias Resolvidas"
                    />
                    <Line
                      type="monotone"
                      dataKey="denuncias"
                      stroke="#143D60"
                      strokeWidth={3}
                      name="Total de Denúncias"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#143D60]">Relatório de Denúncias</CardTitle>
                  <CardDescription>Exportar dados de denúncias por período</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Button
                    onClick={handleDownloadReport} // AQUI ESTÁ A CHAMADA DA FUNÇÃO
                    className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-white flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar relatório mensal
                  </Button>

                  <Button variant="outline" className="w-full border-[#A0C878] text-[#143D60]">
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório Customizado
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#143D60]">Dados de Participação</CardTitle>
                  <CardDescription>Métricas de engajamento dos usuários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-[#143D60] hover:bg-[#0F2F4A] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Relatório de Usuários
                  </Button>
                  <Button variant="outline" className="w-full border-[#143D60] text-[#143D60]">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Análise de Tendências
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}