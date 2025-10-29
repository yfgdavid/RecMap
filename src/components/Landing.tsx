import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Users, FileText } from 'lucide-react';
import { RecMapLogo } from './RecMapLogo';
import { ImpactCarousel } from './ImpactCarousel';
import { UserType } from '../App';

interface LandingProps {
  onUserTypeSelect: (type: UserType) => void;
  onCreateAccount?: (type: UserType) => void;
}

export function Landing({ onUserTypeSelect, onCreateAccount }: LandingProps) {
  const impactData = [
    {
      id: 1,
      icon: '🕳️',
      title: 'Lixo mal destinado',
      statistic: '41%',
      description: 'Mais de 41% do lixo urbano no Brasil ainda tem destino inadequado. Isso significa que quase metade do que produzimos vai parar em lixões ou no meio ambiente.',
      source: 'Agência Brasil (2024) / ABRELPE',
      comment: 'Quase metade do nosso lixo está destruindo o planeta. Cada produto que você joga no lixo tem 41% de chance de parar em lugar errado!'
    },
    {
      id: 2,
      icon: '🚨',
      title: 'Lixões ainda ativos',
      statistic: '1.700+',
      description: 'Mais de 1.700 municípios ainda usam lixões a céu aberto. A lei para acabar com eles foi aprovada há 14 anos — e ainda não foi cumprida.',
      source: 'IBGE (2023), PNRS',
      comment: '14 anos de lei ignorada! Quantas cidades vão continuar envenenando o solo enquanto esperamos?'
    },
    {
      id: 3,
      icon: '♻️',
      title: 'Reciclagem mínima',
      statistic: '2%',
      description: 'Apenas 2% do lixo gerado no Brasil é reciclado. 98% segue para aterros, lixões ou o ambiente natural. E o plástico? Só 1,3% é reaproveitado.',
      source: 'ABREMA, Poder360 (2024)',
      comment: 'Jogamos 98% do lixo fora para sempre. É como queimar dinheiro, mas destruindo a natureza no processo!'
    },
    {
      id: 4,
      icon: '💧',
      title: 'Contaminação invisível',
      statistic: 'Milhões afetados',
      description: 'Chorume de lixões infiltra no solo e contamina lençóis freáticos. Em muitas cidades, a água potável já tem traços de contaminação química e microplásticos.',
      source: 'GESTA/UFBA (2023)',
      comment: 'A água que você bebe hoje pode estar contaminada pelo lixo de ontem. Envenenamento em câmera lenta!'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(221, 235, 157, 0.85), rgba(160, 200, 120, 0.85)), url('https://images.unsplash.com/photo-1642204705127-accc0dcc5779?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMG1hbmFnZW1lbnQlMjBsYW5kZmlsbCUyMGVudmlyb25tZW50fGVufDF8fHx8MTc1OTg4Mzg1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-[#143D60] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <RecMapLogo size="xl" variant="dark" />
              <div>
                <p className="text-lg font-bold">Gestão Inteligente de Resíduos Urbanos</p>
              </div>
            </div>
            
            {/* Navigation e Actions */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => onCreateAccount?.('citizen')}
                variant="ghost"
                className="text-white hover:text-[#A0C878] hover:bg-transparent px-3 py-2 h-auto hidden sm:flex"
              >
                Criar Conta
              </Button>
              <Button 
                onClick={() => onUserTypeSelect('citizen')}
                className="bg-[#A0C878] text-[#143D60] hover:bg-[#DDEB9D] hover:text-[#143D60] px-4 py-2 h-auto"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-[#143D60] mb-6">
            Transforme sua cidade em um ambiente mais limpo e sustentável
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Plataforma colaborativa para mapeamento de pontos de coleta, registro de denúncias ambientais 
            e conscientização sobre o descarte correto de resíduos sólidos urbanos.
          </p>
          
          {/* Carrossel de Dados Impactantes */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-[#143D60] mb-8">
               A Realidade do Lixo no Brasil
            </h3>
            <ImpactCarousel data={impactData} />
          </div>
        </div>
      </section>

      {/* Seleção de Tipo de Usuário */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-[#143D60] mb-12">
            Como você deseja acessar a plataforma?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cidadão */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#A0C878]" 
                  onClick={() => onUserTypeSelect('citizen')}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-[#A0C878] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-[#143D60]">Sou Cidadão</CardTitle>
                <CardDescription className="text-lg">
                  Faço parte da comunidade e quero participar ativamente de práticas sustentáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(160,200,120,1)] rounded-full"></div>
                    Encontrar pontos de coleta próximos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(160,200,120,1)] rounded-full"></div>
                    Registrar denúncias ambientais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(160,200,120,1)] rounded-full"></div>
                    Acompanhar minhas contribuições
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(160,200,120,1)] rounded-full"></div>
                    Aprender sobre descarte correto
                  </li>
                </ul>
                <Button className="w-full bg-[#A0C878] hover:bg-[#8BB668] text-white">
                  Acessar como Cidadão
                </Button>
              </CardContent>
            </Card>

            {/* Governo */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#143D60]" 
                  onClick={() => onUserTypeSelect('government')}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-[#143D60] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-[#143D60]">Sou Gestor Público</CardTitle>
                <CardDescription className="text-lg">
                  Represento órgãos governamentais e preciso de dados para gestão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(20,61,96,1)] rounded-full"></div>
                    Acessar relatórios e dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(20,61,96,1)] rounded-full"></div>
                    Analisar denúncias por região
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(20,61,96,1)] rounded-full"></div>
                    Planejar campanhas ambientais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgba(20,61,96,1)] rounded-full"></div>
                    Exportar dados estratégicos
                  </li>
                </ul>
                <Button className="w-full bg-[#143D60] hover:bg-[#0F2F4A] text-white">
                  Acessar como Gestor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#143D60] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[rgba(255,255,255,1)] text-[16px]">
            Rec'Map – Um produto Recyclex, contribuindo para um futuro mais sustentável através de tecnologia e colaboração
          </p>
          <p className="text-sm mt-2 opacity-75 text-[rgba(255,255,255,1)]">
            © 2025 Rec'Map. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}