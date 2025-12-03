import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { HistoryTimeline } from '../Education/HistoryTimeline';
import { RecMapLogo } from '../RecMapLogo';
import { useEffect } from 'react';
import { LocationInput } from '../LocationInput';
import { LoadingOverlay } from '../LoadingOverlay';
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import type { Report } from '../../types/report';



import {
  MapPin, Camera, Send, History, Award, TrendingUp,
  BookOpen, Recycle, AlertTriangle, CheckCircle,
  Clock, Star, Leaf, LogOut, Filter, Plus,
  Link, CheckCircle2, AlertCircle, X, Loader2
} from 'lucide-react';

import { User } from '../../App';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import MapComponent from '../../components/MapComponent';

interface CitizenDashboardProps {
  user: User;
  onLogout: () => void;
}

interface CollectionPoint {
  id: number | string;
  name: string;
  type: string;
  address: string;
  distance?: string;
  status: 'active' | 'maintenance' | 'full';
  latitude: number | null;
  longitude: number | null;
}




export function CitizenDashboard({ user, onLogout }: CitizenDashboardProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processando...');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatingReportId, setValidatingReportId] = useState<number | null>(null);
  const [pointSuccess, setPointSuccess] = useState<string | null>(null);
  const [pointError, setPointError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newReport, setNewReport] = useState({
    

    title: '',
    description: '',
    location: '',
    type: '',
    image: null as File | null,
  });

  const [newRegister, setNewRegister] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    image: null as File | null,

  });

  // Dados mockados



  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);

  useEffect(() => {
    const fetchMapData = async (isFirstLoad = false) => {
      try {
        if (isFirstLoad) {
          setIsInitialLoading(true);
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/mapa`);
        if (!res.ok) throw new Error('Erro ao buscar dados do mapa');
        const data = await res.json();

        // Transforma pontos e denúncias no mesmo formato
        const allItems: CollectionPoint[] = data
          .map((item: any) => {
            if (item.tipo === 'ponto') {
              return {
                id: `${item.tipo}-${item.id}`,
                name: item.titulo,
                type: 'ponto',
                address: item.descricao,
                status: 'active',
                latitude: item.latitude,
                longitude: item.longitude
              };
            } else if (item.tipo === 'denuncia') {
              return {
                id: `${item.tipo}-${item.id}`,
                name: item.titulo,
                type: 'denuncia',
                address: item.descricao,
                status: item.status.toLowerCase(),
                latitude: item.latitude,
                longitude: item.longitude
              };
            }
            return null;
          })
          .filter(Boolean) as CollectionPoint[];

        // Mantém apenas os 5 mais recentes
        const latestFive = allItems.slice(-5).reverse();
        setCollectionPoints(latestFive);

      } catch (error) {
        console.error('Erro ao buscar dados do mapa:', error);
      } finally {
        if (isFirstLoad) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchMapData(true);
    const interval = setInterval(() => fetchMapData(false), 10000);
    return () => clearInterval(interval);
  }, []);



  const [userReports, setUserReports] = useState<Report[]>([]);



  const carregarDenuncias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/denuncias/usuario/${user.id}`);
      if (!res.ok) throw new Error("Erro ao buscar denúncias");
      const data = await res.json();
      setUserReports(data);
    } catch (err) {
      console.error("Erro ao carregar denúncias:", err);
    }
  };


  useEffect(() => {
    if (user?.id) carregarDenuncias();
  }, [user?.id]);






  const [pendingValidations, setPendingValidations] = useState<Report[]>([]);

  const carregarDenunciasPendentes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/denuncias/pendentes/${user.id}`);
      if (!res.ok) throw new Error("Erro ao buscar denúncias pendentes");
      const data = await res.json();
      setPendingValidations(data);
    } catch (err) {
      console.error("Erro ao carregar denúncias pendentes:", err);
    }
  };

  useEffect(() => {
    if (user?.id) carregarDenunciasPendentes();
  }, [user?.id]);


  const [educationalContent, setEducationalContent] = useState([
    { title: 'Como separar resíduos corretamente', type: 'Vídeo', duration: '2 min', completed: false, url: 'https://www.youtube.com/watch?v=o1HzpLHYEmE' },
    { title: 'Reciclagem de plásticos', type: 'Artigo', duration: '8 min', completed: false, url: 'https://www.plastico.com.br/reciclagem-do-plastico/' },
    { title: 'Quiz da Reciclagem', type: 'Quiz', duration: '3 min', completed: false, url: 'https://crvr.com.br/jogos/quiz-da-reciclagem/' },
    { title: 'Compostagem doméstica', type: 'Vídeo', duration: '17 min', completed: false, url: 'https://www.youtube.com/watch?v=7RV6JfxFvjY' },
    { title: 'O destino do lixo e os desafios do descarte', type: 'Reportagem', duration: '6 min', completed: false, url: 'https://youtu.be/3h2tsLQ_QSg?si=tpkTazORBrwh244A' }
  ]);






  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'validated': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'ponto') return '♻️'; // Todo ponto de coleta recebe ♻️

    switch (type) {
      case 'reciclable': return '♻️';
      case 'organic': return '🌱';
      case 'electronic': return '🔌';
      case 'hazardous': return '⚠️';
      default: return '🗑️';
    }
  };


  const handleValidateReport = async (reportId: number, vote: 'confirm' | 'reject') => {
    setValidatingReportId(reportId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/validacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          id_denuncia: reportId,
          tipo_validacao: vote === 'confirm' ? 'CONFIRMAR' : 'CONTESTAR',
        }),
      });

      if (!res.ok) throw new Error('Erro ao validar denúncia');

      const novaValidacao = await res.json();

      setValidationSuccess(`Denúncia ${vote === 'confirm' ? 'confirmada' : 'contestada'}!`);
      setTimeout(() => setValidationSuccess(null), 5000);

      setPendingValidations(prev =>
        prev.filter(report => report.id_denuncia !== reportId)
      );

      setUserReports(prev =>
        prev.map(report => {
          if (report.id_denuncia === reportId) {
            return {
              ...report,
              validacoes: [...report.validacoes, novaValidacao], // adiciona a validação
            };
          }
          return report;
        })
      );
    } catch (err) {
      console.error('Erro ao validar denúncia:', err);
      setValidationError('Falha ao validar denúncia.');
      setTimeout(() => setValidationError(null), 5000);
    } finally {
      setValidatingReportId(null);
    }
  };



  const filteredPoints = collectionPoints.filter(point =>
    selectedFilter === 'all' || point.type === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isInitialLoading && <LoadingOverlay message="Carregando dados do mapa..." />}
      {(isLoading && !validatingReportId) && <LoadingOverlay message={loadingMessage} />}
      {/* Header */}
      <header className="bg-[#143D60] text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
          {/* Logo e Saudação */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center justify-center">
              <RecMapLogo size="xl" variant="dark" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
              <span className="text-[#DDEB9D] text-xs sm:text-base truncate">
                Olá, {user.name.split(' ')[0]}!
              </span>
              <div className="flex items-center gap-1 text-[#A0C878]"></div>
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
          {/* Navegação Responsiva */}

          <div className="relative">
            {/* Desktop - sem setas, sem scroll */}
            <div className="hidden md:block shadow-sm rounded-lg p-2">
              <div
                className="flex w-auto overflow-visible whitespace-nowrap gap-2"
              >
                <TabsList className="flex gap-2 justify-between w-full">
                  <TabsTrigger value="map" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <MapPin className="w-4 h-4" />
                    <span>Mapa</span>
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <Camera className="w-4 h-4" />
                    <span>Denunciar</span>
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <PlusCircle className="w-4 h-4" />
                    <span>Registrar</span>
                  </TabsTrigger>
                  <TabsTrigger value="my-reports" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <History className="w-4 h-4" />
                    <span>Minhas Denúncias</span>
                  </TabsTrigger>
                  <TabsTrigger value="validate" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <CheckCircle className="w-4 h-4" />
                    <span>Validar</span>
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <BookOpen className="w-4 h-4" />
                    <span>Aprender</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Mobile - com setas e scroll */}
            <div className="md:hidden relative shadow-sm rounded-lg p-2">
              <button
                onClick={() => document.getElementById("tabs-list-mobile")?.scrollBy({ left: -100, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white rounded-full shadow z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>

              <div
                id="tabs-list-mobile"
                className="flex w-full overflow-x-auto whitespace-nowrap gap-2 scrollbar-hide touch-pan-x"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <TabsList className="flex gap-2 w-max">
                  <TabsTrigger value="map" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <MapPin className="w-4 h-4" />
                    <span>Mapa</span>
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <Camera className="w-4 h-4" />
                    <span>Denunciar</span>
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <PlusCircle className="w-4 h-4" />
                    <span>Registrar</span>
                  </TabsTrigger>
                  <TabsTrigger value="my-reports" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <History className="w-4 h-4" />
                    <span>Minhas Denúncias</span>
                  </TabsTrigger>
                  <TabsTrigger value="validate" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <CheckCircle className="w-4 h-4" />
                    <span>Validar</span>
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg transition hover:shadow-md hover:bg-gray-100 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white">
                    <BookOpen className="w-4 h-4" />
                    <span>Aprender</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <button
                onClick={() => document.getElementById("tabs-list-mobile")?.scrollBy({ left: 100, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white rounded-full shadow z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>


          {/* Mapa */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#143D60] text-base sm:text-lg">Pontos de Coleta e Denúncias</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Veja locais próximos a você (clique nos pontos coloridos para exibir mais detalhes.)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mapa Interativo Responsivo */}
                <div className="mb-6 rounded-lg overflow-hidden border-2 border-[#A0C878] shadow-lg">
                  <div className="relative w-full">
                    {/* Aspect ratio container para manter proporções */}

                    <MapComponent selectedLocation={selectedLocation} />

                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPoints.map((point) => (
                    <div
                      key={point.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (point.latitude && point.longitude) {
                          setSelectedLocation({ lat: point.latitude, lng: point.longitude });
                          setActiveTab("map"); // muda imediatamente para a aba do mapa
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getTypeIcon(point.type)}</div>
                        <div>
                          <h4 className="font-medium text-[#143D60]">{point.name}</h4>
                          <p className="text-sm text-gray-600">{point.address}</p>
                          <p className="text-xs text-[#A0C878]">{point.distance}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(point.status)} text-white`}>
                        {point.status === 'active'
                          ? 'Ativo'
                          : point.status === 'maintenance'
                            ? 'Manutenção'
                            : 'Cheio'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Registrar Denúncia */}
          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Registrar Nova Denúncia</CardTitle>
                <CardDescription>Relate problemas ambientais em sua região</CardDescription>
              </CardHeader>

              <CardContent>
                {reportError && (
                  <Alert variant="destructive" className="mb-4 border-red-300 bg-red-50 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{reportError}</span>
                        <button
                          onClick={() => setReportError(null)}
                          className="flex-shrink-0 hover:bg-red-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                {reportSuccess && (
                  <Alert className="mb-4 border-green-300 bg-green-50 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{reportSuccess}</span>
                        <button
                          onClick={() => setReportSuccess(null)}
                          className="flex-shrink-0 hover:bg-green-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("id_usuario", user.id);
                    formData.append("titulo", newReport.title);
                    formData.append("descricao", newReport.description);
                    formData.append("localizacao", newReport.location);
                    if (newReport.image) formData.append("foto", newReport.image);

                    try {
                      setReportError(null);
                      setReportSuccess(null);
                      setLoadingMessage('Enviando denúncia...');
                      setIsLoading(true);

                      const res = await fetch(`${import.meta.env.VITE_API_URL}/denuncias`, {
                        method: "POST",
                        body: formData,
                      });

                      if (!res.ok) throw new Error("Erro ao enviar denúncia");

                      setReportSuccess("Denúncia enviada com sucesso!");
                      setNewReport({ title: "", description: "", location: "", type: "", image: null });
                      await carregarDenuncias();

                      // Limpa a mensagem de sucesso após 5 segundos
                      setTimeout(() => setReportSuccess(null), 5000);

                    } catch (err) {
                      setReportError("Falha ao enviar denúncia. Tente novamente.");
                      console.error(err);

                      // Limpa a mensagem de erro após 5 segundos
                      setTimeout(() => setReportError(null), 5000);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="space-y-4"
                  encType="multipart/form-data"
                >
                  {/* Título */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título da Denúncia</label>
                    <Input
                      placeholder="Ex: Lixo acumulado na rua..."
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <Select
                    value={newReport.type}
                    onValueChange={(value: string) => setNewReport({ ...newReport, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lixo-irregular">Descarte Irregular</SelectItem>
                      <SelectItem value="ponto-danificado">Ponto de Coleta Danificado</SelectItem>
                      <SelectItem value="entulho">Entulho</SelectItem>
                      <SelectItem value="esgoto">Esgoto a Céu Aberto</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Localização */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Localização</label>
                    <LocationInput
                      value={newReport.location}
                      onChange={(val) => setNewReport({ ...newReport, location: val })}
                    />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      placeholder="Descreva detalhadamente o problema encontrado..."
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Foto */}
                  <div className="flex items-center gap-4 p-4 bg-[#DDEB9D] rounded-lg">
                    <Camera className="w-8 h-8 text-[#143D60]" />
                    <div>
                      <p className="font-medium text-[#143D60]">Adicionar Foto</p>
                      <p className="text-sm text-gray-600">Adicione evidências fotográficas (opcional)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="foto-denuncia"
                      onChange={(e) =>
                        setNewReport({ ...newReport, image: e.target.files ? e.target.files[0] : null })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-auto"
                      onClick={() => document.getElementById("foto-denuncia")?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Foto
                    </Button>
                  </div>

                  {/* Preview da imagem */}
                  {newReport.image && (
                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(newReport.image)}
                        alt="Preview"
                        className="max-h-48 rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Botão enviar */}
                  <Button
                    type="submit"
                    className="w-full bg-[rgba(20,61,96,1)] hover:bg-[#D54E00] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Denúncia
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrar Ponto de coleta */}
          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Registrar Novo ponto de coleta</CardTitle>
                <CardDescription>Compartilhe locais seguros de descarte conosco!</CardDescription>
              </CardHeader>

              <CardContent>
                {pointError && (
                  <Alert variant="destructive" className="mb-4 border-red-300 bg-red-50 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{pointError}</span>
                        <button
                          onClick={() => setPointError(null)}
                          className="flex-shrink-0 hover:bg-red-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                {pointSuccess && (
                  <Alert className="mb-4 border-green-300 bg-green-50 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{pointSuccess}</span>
                        <button
                          onClick={() => setPointSuccess(null)}
                          className="flex-shrink-0 hover:bg-green-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoadingMessage('Registrando ponto de coleta...');
                    setIsLoading(true);
                    const formData = new FormData();
                    formData.append("id_usuario", user.id);
                    formData.append("titulo", newRegister.title);
                    formData.append("descricao", newRegister.description);
                    formData.append("localizacao", newRegister.location);
                    if (newRegister.image) formData.append("foto", newRegister.image);

                    try {
                      setLoadingMessage('Registrando ponto de coleta...');
                      setIsLoading(true);

                      const res = await fetch(`${import.meta.env.VITE_API_URL}/pontos`, {
                        method: "POST",
                        body: formData,
                      });

                      if (!res.ok) throw new Error("Erro ao Registrar ponto de coleta");

                      setPointSuccess("Ponto de coleta registrado com sucesso!");
                      setNewRegister({ title: "", description: "", location: "", type: "", image: null });
                      setTimeout(() => setPointSuccess(null), 5000);

                    } catch (err) {
                      setPointError("Falha ao registrar ponto de coleta.");
                      console.error(err);
                      setTimeout(() => setPointError(null), 5000);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="space-y-4"
                  encType="multipart/form-data"
                >
                  {/* Título */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Local</label>
                    <Input
                      placeholder="Ex: Ecoestação Imbiribeira"
                      value={newRegister.title}
                      onChange={(e) => setNewRegister({ ...newRegister, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <Select
                    value={newRegister.type}
                    onValueChange={(value: string) => setNewRegister({ ...newRegister, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reciclavel">Reciclavel</SelectItem>
                      <SelectItem value="organico">Orgânico</SelectItem>
                      <SelectItem value="eletronico">Eletronico</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Localização */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Localização</label>
                    <LocationInput
                      value={newRegister.location}
                      onChange={(val) => setNewRegister({ ...newRegister, location: val })}
                    />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      placeholder="Descreva o local de coleta..."
                      value={newRegister.description}
                      onChange={(e) => setNewRegister({ ...newRegister, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Foto */}
                  <div className="flex items-center gap-4 p-4 bg-[#DDEB9D] rounded-lg">
                    <Camera className="w-8 h-8 text-[#143D60]" />
                    <div>
                      <p className="font-medium text-[#143D60]">Adicionar Foto</p>
                      <p className="text-sm text-gray-600">Adicione evidências fotográficas (opcional)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="foto-ponto"
                      onChange={(e) =>
                        setNewRegister({ ...newRegister, image: e.target.files ? e.target.files[0] : null })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-auto"
                      onClick={() => document.getElementById("foto-ponto")?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Foto
                    </Button>
                  </div>

                  {/* Preview da imagem */}
                  {newRegister.image && (
                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(newRegister.image)}
                        alt="Preview"
                        className="max-h-48 rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Botão enviar */}
                  <Button
                    type="submit"
                    className="w-full bg-[rgba(20,61,96,1)] hover:bg-[#D54E00] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Registro
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Minhas Denúncias */}
          <TabsContent value="my-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Minhas Denúncias</CardTitle>
                <CardDescription>
                  Acompanhe o status das suas contribuições
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {userReports.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Você ainda não fez nenhuma denúncia.
                    </p>
                  ) : (
                    userReports.map((report) => {
                      const count = report.validacoes?.length || 0;

                      return (
                        <div
                          key={report.id_denuncia}
                          className="p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-[#143D60]">
                              {report.titulo}
                            </h4>

                            <Badge
                              className={`${getStatusColor(report.status)} text-white`}
                            >
                              {report.status === "PENDENTE"
                                ? "Pendente"
                                : report.status === "VALIDADA"
                                  ? "Validada"
                                  : report.status === "ENCAMINHADA"
                                    ? "Encaminhada"
                                    : "Resolvida"}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {report.descricao}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {report.localizacao || "Localização não informada"} •{" "}
                              {new Date(report.data_criacao).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>

                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3" />

                              <span>
                                {count} {count === 1 ? "validação" : "validações"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Validar Denúncias */}
          <TabsContent value="validate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Validar Denúncias da Comunidade</CardTitle>
                <CardDescription>Ajude a validar denúncias de outros cidadãos</CardDescription>
              </CardHeader>
              <CardContent>
                {validationError && (
                  <Alert variant="destructive" className="mb-4 border-red-300 bg-red-50 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{validationError}</span>
                        <button
                          onClick={() => setValidationError(null)}
                          className="flex-shrink-0 hover:bg-red-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                {validationSuccess && (
                  <Alert className="mb-4 border-green-300 bg-green-50 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex-1">{validationSuccess}</span>
                        <button
                          onClick={() => setValidationSuccess(null)}
                          className="flex-shrink-0 hover:bg-green-100 rounded-full p-1 transition-colors"
                          aria-label="Fechar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  {pendingValidations.map((report) => {
                    const isValidating = validatingReportId === report.id_denuncia;
                    return (
                      <div key={report.id_denuncia} className={`p-4 border rounded-lg transition-opacity ${isValidating ? 'opacity-60' : ''}`}>
                        <h4 className="font-medium text-[#143D60] mb-2">{report.titulo}</h4>
                        <p className="text-sm text-gray-600 mb-3">{report.descricao}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {report.localizacao} • {report.data_criacao} •{" "}
                            <span>
                              {report.validacoes?.length ?? 0}{" "}
                              {report.validacoes?.length === 1 ? "validação" : "validações"}
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            {isValidating && (
                              <div className="flex items-center gap-2 text-sm text-[#143D60] mr-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Validando...</span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleValidateReport(report.id_denuncia, 'reject')}
                              disabled={isValidating}
                              className="border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Contestar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleValidateReport(report.id_denuncia, 'confirm')}
                              disabled={isValidating}
                              className="bg-[#A0C878] hover:bg-[#8BB668] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirmar
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Educação */}
          <TabsContent value="education" className="space-y-6">
            {/* Timeline Histórica */}
            <HistoryTimeline />

            {/* Conteúdos Educativos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Conteúdos Educativos</CardTitle>
                <CardDescription>Aprenda sobre separação e descarte correto de resíduos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {educationalContent.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${content.completed ? 'bg-[#A0C878]' : 'bg-gray-200'
                            }`}
                        >
                          {content.type === 'Quiz' ? '🧠' : content.type === 'Vídeo' ? '🎥' : '📖'}
                        </div>
                        <div>
                          <h4 className="font-medium text-[#143D60]">{content.title}</h4>
                          <p className="text-sm text-gray-600">
                            {content.type} • {content.duration}
                          </p>
                        </div>
                      </div>

                      <Button
                        className={`text-white ${content.completed ? 'bg-gray-300' : 'bg-[#A0C878] hover:bg-[#8BB668]'
                          }`}
                        onClick={() => {
                          // Marca como concluído
                          setEducationalContent(prev => {
                            const newContent = [...prev];
                            newContent[index].completed = true;
                            return newContent;
                          });

                          // Abre o link em nova aba
                          window.open(content.url, '_blank');
                        }}
                      >
                        {content.completed ? 'Concluído' : 'Iniciar'}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Barra de progresso */}
                <div className="mt-6 p-4 bg-[#DDEB9D] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#143D60]">Progresso de Aprendizado</h4>
                    <span className="text-sm text-[#143D60]">
                      {Math.round((educationalContent.filter(c => c.completed).length / educationalContent.length) * 100)}%
                    </span>
                  </div>
                  <Progress value={(educationalContent.filter(c => c.completed).length / educationalContent.length) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    {educationalContent.filter(c => c.completed).length} de {educationalContent.length} conteúdos concluídos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
