import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { HistoryCarousel } from '../HistoryCarousel';
import { 
  Calendar, TrendingUp, AlertTriangle, Target, 
  Recycle, Leaf, Users, BookOpen
} from 'lucide-react';

export function HistoryTimeline() {
  const historyData = [
    {
      year: "2000-2009",
      title: "Era dos Lixões",
      description: "Crescimento urbano acelerado, dados escassos sobre resíduos. Lixões predominantes, coleta seletiva praticamente inexistente. Capacidade técnica limitada e poucos recursos disponíveis.",
      icon: "🏚️",
      color: "#8BB668"
    },
    {
      year: "2010-2016", 
      title: "Marco da PNRS",
      description: "Lei 12.305/2010 estabelece a Política Nacional de Resíduos Sólidos. Responsabilidade compartilhada e hierarquia de resíduos. 67M ton/ano geradas, 88% de cobertura, mas prazos não cumpridos.",
      icon: "📜",
      color: "#A0C878"
    },
    {
      year: "2020-Presente",
      title: "Avanços e Desafios",
      description: "79-82M ton/ano geradas, 90,5% de cobertura populacional. Melhoria na destinação adequada (93% coletados), mas apenas 2-3% de reciclagem efetiva. Lixões ainda persistem.",
      icon: "♻️",
      color: "#DDEB9D"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#A0C878] to-[#DDEB9D] border-2 border-[#143D60]">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight text-[#143D60]">
            A Evolução dos Resíduos no Brasil
          </CardTitle>
          <CardDescription className="text-[#143D60] text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed pb-4 sm:pb-6 border-0 font-medium">
            Uma jornada de conscientização e transformação ambiental
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Carrossel Histórico */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-[#143D60] mb-6">
           Como chegamos até aqui
        </h3>
        <HistoryCarousel data={historyData} />
      </div>

      {/* Visão 2030 - Fixo */}
      <Card className="bg-gradient-to-r from-[#A0C878] to-[#DDEB9D] border-2 border-[#143D60]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-[#143D60]" />
            <CardTitle className="text-3xl text-[#143D60]">2030</CardTitle>
          </div>
          <CardTitle className="text-2xl text-[#143D60] mb-2">
            Como você quer que seja em 2030?
          </CardTitle>
          <CardDescription className="text-[#143D60] text-lg font-medium">
            Faça sua parte e transforme o futuro dos resíduos no Brasil!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#143D60] rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-[#143D60] mb-2">15-20% Reciclagem</h4>
              <p className="text-sm text-gray-700">Meta: quintuplicar a taxa de reciclagem atual</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#143D60] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-[#143D60] mb-2">Zero Lixões</h4>
              <p className="text-sm text-gray-700">Eliminação completa dos lixões a céu aberto</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#143D60] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-[#143D60] mb-2">100% Coleta Seletiva</h4>
              <p className="text-sm text-gray-700">Cobertura universal em todas as regiões</p>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-[#143D60] mb-4">Sua Contribuição Importa!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[rgba(20,61,96,1)] rounded-full"></div>
                <span>Registre denúncias e ajude a fiscalizar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[rgba(20,61,96,1)] rounded-full"></div>
                <span>Separe corretamente seus resíduos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[rgba(20,61,96,1)] rounded-full"></div>
                <span>Valide denúncias da comunidade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[rgba(20,61,96,1)] rounded-full"></div>
                <span>Eduque outros sobre sustentabilidade</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-[#143D60] font-medium mb-2">Progresso Nacional Esperado</p>
              <Progress value={50} className="mb-2" />
              <p className="text-xs text-gray-600">Com sua ajuda, podemos atingir 50% das metas até 2030!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}