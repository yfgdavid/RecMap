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
  AlertTriangle, CheckCircle, Clock, Leaf, LogOut, MoreVertical, Send, Image as ImageIcon
} from 'lucide-react';


import { User } from '../../App';

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
  estatisticas: {
    denuncias: {
      total: number;
      porStatus: Array<{ status: string; quantidade: number }>;
    };
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
    }>;
  };
}

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/governamental/dashboard`);
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do dashboard');
        }
        const result = await response.json();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mapear dados dos gráficos
  const reportsData = dashboardData?.graficos.evolucaoMensal.map(item => ({
    month: item.mes,
    denuncias: item.total,
    resolvidas: item.resolvidas
  })) || [];



  // Mapear dados de tipos de denúncias para o gráfico de pizza
  const tiposDenunciasData = dashboardData?.graficos.distribuicaoTipos.map(item => {
    const colors: { [key: string]: string } = {
      'Descarte Irregular': '#FCD34D',
      'Ponto de Coleta Danificado': '#60A5FA',
      'Entulho': '#FB923C',
      'Esgoto a Céu Aberto': '#EF4444',
      'Outros': '#A0C878'
    };



    return {
      name: item.tipo,
      value: item.porcentagem,
      quantidade: item.quantidade,
      color: colors[item.tipo] || '#A0C878'
    };
  }) || [];

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

  // Buscar denúncias da API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_URL}/governamental/denuncias`);
        if (!response.ok) {
          throw new Error('Erro ao carregar denúncias');
        }
        const result = await response.json();
        if (result.success && result.data) {
          const denunciasFormatadas = result.data.denuncias.map((d: any) => ({
            id: d.id,
            titulo: d.titulo,
            regiao: d.localizacao || 'Não informado',
            status: d.status.toLowerCase(),
            data: new Date(d.data_criacao).toISOString().split('T')[0],
            foto: d.foto || '' // <-- adiciona a foto aqui
          }));
          setReports(denunciasFormatadas);
        }
      } catch (err) {
        console.error('Erro ao buscar denúncias:', err);
      }
    };

    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const handleForwardReport = async (reportId: number) => {
    try {
      const response = await fetch(`${API_URL}/governamental/denuncias/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ENCAMINHADA' }),
      });
      if (!response.ok) {
        throw new Error('Erro ao encaminhar denúncia');
      }
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, status: 'encaminhada' } : report
        )
      );
    } catch (err) {
      console.error('Erro ao encaminhar denúncia:', err);
      alert('Erro ao encaminhar denúncia. Tente novamente.');
    }
  };

  const handleOpenPhoto = (url: string) => {
    window.open(url, "_blank");
  };

  const handleResolveReport = async (reportId: number) => {
    try {
      const response = await fetch(`${API_URL}/governamental/denuncias/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'RESOLVIDA' }),
      });
      if (!response.ok) {
        throw new Error('Erro ao resolver denúncia');
      }
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, status: 'resolvida' } : report
        )
      );
    } catch (err) {
      console.error('Erro ao resolver denúncia:', err);
      alert('Erro ao resolver denúncia. Tente novamente.');
    }
  };



  const getFotoUrl = (foto: string | undefined) => {
    if (!foto) return "";

    // Se já for URL completa (http ou https)
    if (foto.startsWith("http")) return foto;

    // Remove QUALQUER barra inicial
    const cleanFoto = foto.replace(/^\/+/, "");

    // Garante que a URL base não tem barra no final
    const cleanApi = API_URL.replace(/\/+$/, "");

    // Monta a URL final garantindo apenas 1 única barra
    return `${cleanApi}/uploads/${cleanFoto.replace(/^uploads\//, "")}`;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#143D60] text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">

          {/* Logo + Saudação */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center justify-center">
              <RecMapLogo size="xl" variant="dark" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
              <span className="text-[#DDEB9D] text-xs sm:text-base truncate">
                Bem-vindo, {user.name.split(' ')[0]}!
              </span>
            </div>
          </div>

          {/* Botão Sair */}
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex-shrink-0 bg-transparent border-[#A0C878] text-[#DDEB9D] hover:bg-[#A0C878] hover:text-white transition-colors px-2 sm:px-4 h-8 sm:h-9"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border-l-4 border-l-[#A0C878]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total de Denúncias</p>
                          <p className="text-2xl font-bold text-[#143D60]">
                            {dashboardData?.cards.totalDenuncias.valor.toLocaleString('pt-BR') || '0'}
                          </p>
                          <p className={`text-xs ${dashboardData?.cards.totalDenuncias.tendencia === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardData?.cards.totalDenuncias.variacao || '0%'} {dashboardData?.cards.totalDenuncias.periodo || ''}
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
                          <p className="text-2xl font-bold text-[#143D60]">
                            {dashboardData?.cards.denunciasResolvidas.valor.toLocaleString('pt-BR') || '0'}
                          </p>
                          <p className="text-xs text-green-600">
                            {dashboardData?.cards.denunciasResolvidas.taxa || '0% de resolução'}
                          </p>
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
                          <p className="text-2xl font-bold text-[#143D60]">
                            {dashboardData?.cards.usuariosAtivos.valor.toLocaleString('pt-BR') || '0'}
                          </p>
                          <p className={`text-xs ${dashboardData?.cards.usuariosAtivos.tendencia === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardData?.cards.usuariosAtivos.variacao || '0%'} {dashboardData?.cards.usuariosAtivos.periodo || ''}
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
                          <p className="text-2xl font-bold text-[#143D60]">
                            {dashboardData?.cards.pontosColeta.valor.toLocaleString('pt-BR') || '0'}
                          </p>
                          <p className="text-xs text-blue-600">
                            {dashboardData?.cards.pontosColeta.novos || 'Sem novos pontos'}
                          </p>
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
                      {reportsData.length > 0 ? (
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
                      ) : (
                        <div className="flex items-center justify-center h-[300px]">
                          <p className="text-gray-500">Sem dados disponíveis</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#143D60]">Denúncias</CardTitle>
                      <CardDescription>Distribuição das denúncias por tipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tiposDenunciasData.length > 0 ? (
                        <div className="w-full">
                          <ResponsiveContainer width="100%" height={280} className="hidden md:block">
                            <PieChart>
                              <Pie
                                data={tiposDenunciasData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                                labelLine={{ stroke: '#A0C878', strokeWidth: 1 }}
                              >
                                {tiposDenunciasData.map((entry, index) => (
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
                                data={tiposDenunciasData}
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                dataKey="value"
                              >
                                {tiposDenunciasData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>

                          {/* Legenda Customizada Responsiva */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                            {tiposDenunciasData.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-medium text-[#143D60] truncate">{item.name}</span>
                                  <span className="text-xs text-gray-600">{item.value}% ({item.quantidade})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[280px]">
                          <p className="text-gray-500">Sem dados disponíveis</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Denúncias */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Denúncias Recentes</CardTitle>
                <CardDescription>Últimas denúncias registradas na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && activeTab === "reports" ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-600">Carregando denúncias...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Nenhuma denúncia encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => {
                      const StatusIcon = getStatusIcon(report.status);
                      const canTakeAction = report.status !== "resolvida";

                      return (
                        <div
                          key={report.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3"
                        >
                          {/* Info da denúncia */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <StatusIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-[#143D60]">{report.titulo}</h4>
                              <p className="text-sm text-gray-600">
                                {report.regiao} • {report.data}
                              </p>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Status */}
                            <Badge className={`${getStatusColor(report.status)} text-white`}>
                              {report.status}
                            </Badge>

                            {/* Botão Ver Foto só aparece se houver foto */}
                            {report.foto && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(report.foto, "_blank")}
                                className="border-[#143D60] text-[#143D60] hover:bg-[#143D60] hover:text-white flex items-center gap-1"
                              >
                                <ImageIcon className="w-4 h-4" />
                                Ver Foto
                              </Button>
                            )}
                            {/* Dropdown de ações */}
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
                                  {(report.status === "pendente" || report.status === "validada") && (
                                    <DropdownMenuItem
                                      onClick={() => handleForwardReport(report.id)}
                                      className="cursor-pointer"
                                    >
                                      <Send className="w-4 h-4 mr-2 text-orange-500" />
                                      <span>Encaminhar</span>
                                    </DropdownMenuItem>
                                  )}
                                  {report.status === "encaminhada" && (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
          );



          {/* Análises */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Tendência de Resolução</CardTitle>
                <CardDescription>Taxa de resolução de denúncias ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsData.length > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-gray-500">Sem dados disponíveis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exports" className="flex justify-center">
            <div className="w-full max-w-xl">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-[#143D60] text-lg">Relatório de Denúncias</CardTitle>
                  <CardDescription className="text-base">
                    Exportar dados de denúncias por período
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-white flex items-center justify-center py-6 text-lg">
                    <a
                      href={`${(import.meta as any).env?.VITE_API_URL ||
                        "http://localhost:3333"
                        }/relatorios/infografico`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full"
                    >
                      Baixar relatório mensal
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-[#A0C878] text-[#143D60] py-6 text-lg"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório Customizado
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