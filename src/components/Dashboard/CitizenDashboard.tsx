import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { HistoryTimeline } from '../Education/HistoryTimeline';
import { RecMapLogo } from '../RecMapLogo';
import { useEffect } from 'react';

import { 
  MapPin, Camera, Send, History, Award, TrendingUp,
  BookOpen, Recycle, AlertTriangle, CheckCircle, 
  Clock, Star, Leaf, LogOut, Filter, Plus,
  Link
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
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  status: 'active' | 'maintenance' | 'full';
}

interface Report {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'validated' | 'resolved';
  date: string;
  location: string;
  votes: number;
}

export function CitizenDashboard({ user, onLogout }: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newReport, setNewReport] = useState({
  title: '',
  description: '',
  location: '',
  type: '',
  image: null as File | null,
});


  // Dados mockados
  

const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);

useEffect(() => {
  const fetchMapData = async () => {
    try {
      const res = await fetch('http://localhost:3333/mapa');
      if (!res.ok) throw new Error('Erro ao buscar dados do mapa');
      const data = await res.json();

      // Transforma pontos e denúncias no mesmo formato
      const allItems: CollectionPoint[] = data.map((item: any) => {
        if (item.tipo === 'ponto') {
          return {
            id: item.id,
            name: item.titulo,
            type: 'ponto',
            address: item.descricao,
            status: 'active'
          };
        } else if (item.tipo === 'denuncia') {
          return {
            id: item.id,
            name: item.titulo,
            type: 'denuncia',
            address: item.descricao,
            status: item.status.toLowerCase()
          };
        }
        return null;
      }).filter(Boolean) as CollectionPoint[];

      // Mantém apenas os 5 mais recentes
      const latestFive = allItems.slice(-5).reverse();
      setCollectionPoints(latestFive);

    } catch (error) {
      console.error('Erro ao buscar dados do mapa:', error);
    }
  };

  fetchMapData();
  const interval = setInterval(fetchMapData, 10000);
  return () => clearInterval(interval);
}, []);



  const userReports: Report[] = [
    { id: 1, title: 'Lixo acumulado na Rua da Aurora', description: 'Grande quantidade de lixo...', status: 'validated', date: '2024-10-05', location: 'Centro', votes: 8 },
    { id: 2, title: 'Entulho em terreno baldio', description: 'Materiais de construção...', status: 'pending', date: '2024-10-07', location: 'Boa Vista', votes: 3 },
    { id: 3, title: 'Ponto de coleta danificado', description: 'Container de lixo quebrado...', status: 'resolved', date: '2024-10-01', location: 'Derby', votes: 12 }
  ];

  const pendingValidations: Report[] = [
    { id: 4, title: 'Descarte irregular próximo ao rio', description: 'Vários sacos de lixo...', status: 'pending', date: '2024-10-07', location: 'Várzea', votes: 2 },
    { id: 5, title: 'Esgoto a céu aberto', description: 'Vazamento de esgoto...', status: 'pending', date: '2024-10-06', location: 'Imbiribeira', votes: 5 }
  ];

  const [educationalContent, setEducationalContent] = useState([
  { title: 'Como separar resíduos corretamente', type: 'Vídeo', duration: '2 min', completed: false, url:'https://www.youtube.com/watch?v=o1HzpLHYEmE' },
  { title: 'Reciclagem de plásticos', type: 'Artigo', duration: '8 min', completed: false, url: 'https://www.plastico.com.br/reciclagem-do-plastico/' },
  { title: 'Quiz da Reciclagem', type: 'Quiz', duration: '3 min', completed: false, url:'https://crvr.com.br/jogos/quiz-da-reciclagem/' },
  { title: 'Compostagem doméstica', type: 'Vídeo', duration: '17 min', completed: false, url: 'https://www.youtube.com/watch?v=7RV6JfxFvjY' },
  { title: 'O destino do lixo e os desafios do descarte', type: 'Reportagem', duration: '6 min', completed: false, url:  'https://youtu.be/3h2tsLQ_QSg?si=tpkTazORBrwh244A'}
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
    switch (type) {
      case 'reciclable': return '♻️';
      case 'organic': return '🌱';
      case 'electronic': return '🔌';
      case 'hazardous': return '⚠️';
      default: return '🗑️';
    }
  };


  const handleValidateReport = (reportId: number, vote: 'confirm' | 'reject') => {
    alert(`Voto registrado: ${vote === 'confirm' ? 'Confirmado' : 'Contestado'}`);
  };

  const filteredPoints = collectionPoints.filter(point => 
    selectedFilter === 'all' || point.type === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#143D60] text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo e Saudação - Layout Compacto */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0">
                <RecMapLogo size="md" variant="dark" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="text-[#DDEB9D] text-xs sm:text-base truncate">
                  Olá, {user.name.split(' ')[0]}!
                </span>
                <div className="flex items-center gap-1 text-[#A0C878]">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#A0C878]" />
                  <span className="text-xs sm:text-base font-medium">127 pts</span>
                </div>
              </div>
            </div>
            
            {/* Botão Sair - Compacto */}
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navegação Responsiva */}
          <div className="bg-white shadow-sm rounded-lg p-2 overflow-x-auto">
            <TabsList className="inline-flex w-full min-w-max md:grid md:grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger 
                value="map" 
                className="flex items-center gap-2 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white whitespace-nowrap px-4 py-2"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Mapa</span>
              </TabsTrigger>
              <TabsTrigger 
                value="report" 
                className="flex items-center gap-2 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white whitespace-nowrap px-4 py-2"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Denunciar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-reports" 
                className="flex items-center gap-2 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white whitespace-nowrap px-4 py-2"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Minhas Denúncias</span>
              </TabsTrigger>
              <TabsTrigger 
                value="validate" 
                className="flex items-center gap-2 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white whitespace-nowrap px-4 py-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Validar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="flex items-center gap-2 data-[state=active]:bg-[#A0C878] data-[state=active]:text-white whitespace-nowrap px-4 py-2"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Aprender</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mapa */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#143D60] text-base sm:text-lg">Pontos de Coleta e Denúncias</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Veja locais próximos a você</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="reciclable">Reciclável</SelectItem>
                        <SelectItem value="organic">Orgânico</SelectItem>
                        <SelectItem value="electronic">Eletrônico</SelectItem>
                        <SelectItem value="hazardous">Perigoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mapa Interativo Responsivo */}
                <div className="mb-6 rounded-lg overflow-hidden border-2 border-[#A0C878] shadow-lg">
                  <div className="relative w-full">
                    {/* Aspect ratio container para manter proporções */}
             
                      <MapComponent />
                      {/* Overlay com legenda permanece igual */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#143D60]/90 to-transparent p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-white">
                          <p className="text-sm font-medium">Legenda:</p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                              <span className="text-xs sm:text-sm">Denúncias</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                              <span className="text-xs sm:text-sm">Pontos de coleta</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                

                <div className="space-y-4">
                  {filteredPoints.map((point) => (
                    <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getTypeIcon(point.type)}</div>
                        <div>
                          <h4 className="font-medium text-[#143D60]">{point.name}</h4>
                          <p className="text-sm text-gray-600">{point.address}</p>
                          <p className="text-xs text-[#A0C878]">{point.distance}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(point.status)} text-white`}>
                        {point.status === 'active' ? 'Ativo' : point.status === 'maintenance' ? 'Manutenção' : 'Cheio'}
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
  <form
    onSubmit={async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("id_usuario", user.id); // id já é string
      formData.append("titulo", newReport.title);
      formData.append("descricao", newReport.description);
      formData.append("localizacao", newReport.location);
      if (newReport.image) formData.append("foto", newReport.image);

      console.log("FormData enviado:");
for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

      try {
        const res = await fetch("http://localhost:3333/denuncias", {
          method: "POST",
          body: formData, // ✅ não colocar headers
        });

        if (!res.ok) throw new Error("Erro ao enviar denúncia");

        alert("✅ Denúncia enviada com sucesso!");
        setNewReport({ title: "", description: "", location: "", type: "", image: null });
      } catch (err) {
        alert("❌ Falha ao enviar denúncia.");
        console.error(err);
      }
    }}
    className="space-y-4"
    encType="multipart/form-data" // ✅ ESSENCIAL
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
      <Input
        placeholder="Ex: Rua da Aurora, 123, Centro"
        value={newReport.location}
        onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
        required
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
        id="foto-upload"
        onChange={(e) =>
          setNewReport({ ...newReport, image: e.target.files ? e.target.files[0] : null })
        }
      />
      <Button
        type="button"
        variant="outline"
        className="ml-auto"
        onClick={() => document.getElementById("foto-upload")?.click()}
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

          {/* Minhas Denúncias */}
          <TabsContent value="my-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#143D60]">Minhas Denúncias</CardTitle>
                <CardDescription>Acompanhe o status das suas contribuições</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-[#143D60]">{report.title}</h4>
                        <Badge className={`${getStatusColor(report.status)} text-white`}>
                          {report.status === 'pending' ? 'Pendente' : 
                           report.status === 'validated' ? 'Validada' : 'Resolvida'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{report.location} • {report.date}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{report.votes} validações</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <div className="space-y-4">
                  {pendingValidations.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-[#143D60] mb-2">{report.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {report.location} • {report.date} • {report.votes} validações
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleValidateReport(report.id, 'reject')}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            Contestar
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleValidateReport(report.id, 'confirm')}
                            className="bg-[#A0C878] hover:bg-[#8BB668] text-white"
                          >
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  content.completed ? 'bg-[#A0C878]' : 'bg-gray-200'
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
            className={`text-white ${
              content.completed ? 'bg-gray-300' : 'bg-[#A0C878] hover:bg-[#8BB668]'
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
