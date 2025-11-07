import React, { useState } from 'react';
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

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([
    { id: 1, titulo: 'Lixão próximo ao Rio Capibaribe', regiao: 'Centro', status: 'pendente', data: '2024-10-07' },
    { id: 2, titulo: 'Entulho em terreno baldio', regiao: 'Norte', status: 'validada', data: '2024-10-06' },
    { id: 3, titulo: 'Esgoto a céu aberto', regiao: 'Sul', status: 'encaminhada', data: '2024-10-05' },
    { id: 4, titulo: 'Acúmulo de lixo na praça', regiao: 'Leste', status: 'pendente', data: '2024-10-04' },
    { id: 5, titulo: 'Descarte irregular de entulho', regiao: 'Centro', status: 'encaminhada', data: '2024-10-03' }
  ]);

  // Dados mockados para os gráficos
  const reportsData = [
    { month: 'Jan', denuncias: 45, resolvidas: 32 },
    { month: 'Fev', denuncias: 52, resolvidas: 41 },
    { month: 'Mar', denuncias: 38, resolvidas: 35 },
    { month: 'Abr', denuncias: 61, resolvidas: 45 },
    { month: 'Mai', denuncias: 55, resolvidas: 48 },
    { month: 'Jun', denuncias: 67, resolvidas: 52 }
  ];

  const wasteTypesData = [
    { name: 'Orgânico', value: 40, color: '#A0C878' },
    { name: 'Reciclável', value: 35, color: '#DDEB9D' },
    { name: 'Perigoso', value: 15, color: '#8BB668' },
    { name: 'Eletrônico', value: 10, color: '#143D60' }
  ];

  const regionData = [
    { regiao: 'Centro', denuncias: 45, status: 'Alto' },
    { regiao: 'Norte', denuncias: 32, status: 'Médio' },
    { regiao: 'Sul', denuncias: 28, status: 'Médio' },
    { regiao: 'Leste', denuncias: 52, status: 'Alto' },
    { regiao: 'Oeste', denuncias: 18, status: 'Baixo' }
  ];

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

  const handleForwardReport = (reportId: number) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: 'encaminhada' } : report
      )
    );
  };

  const handleResolveReport = (reportId: number) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: 'resolvida' } : report
      )
    );
  };

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
                      <p className="text-2xl font-bold text-[#143D60]">318</p>
                      <p className="text-xs text-green-600">+12% este mês</p>
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
                      <p className="text-2xl font-bold text-[#143D60]">253</p>
                      <p className="text-xs text-green-600">79.6% de resolução</p>
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
                      <p className="text-2xl font-bold text-[#143D60]">1,247</p>
                      <p className="text-xs text-green-600">+8% este mês</p>
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
                      <p className="text-2xl font-bold text-[#143D60]">89</p>
                      <p className="text-xs text-blue-600">+3 novos pontos</p>
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
                  <Button className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-white flex items-center justify-center">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/relatorios/infografico`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full"
                    >
                      Baixar relatório mensal
                    </a>
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