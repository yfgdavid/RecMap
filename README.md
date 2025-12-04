# 🗺️ RecMap Frontend

Interface web do RecMap, plataforma de mapeamento de resíduos urbanos, denúncias ambientais e painel governamental.

## 🚀 Tecnologias

- React + TypeScript
- Vite
- TailwindCSS
- Axios
- Leaflet (mapa)
- React Router
- Recharts (gráficos)

## ✨ Funcionalidades

### 👤 Usuários
- Login e cadastro
- Recuperação de senha

### 🗺️ Mapa
- Exibição de pontos de coleta
- Exibição de denúncias
- Filtros por tipo/status
- Geolocalização do usuário

### 🚨 Denúncias
- Criar denúncia com foto e localização automática
- Listar e gerenciar denúncias do usuário

### 📍 Pontos de Coleta
- Listagem e visualização no mapa

### 📊 Dashboard Governamental
- Gráficos interativos
- Lista de denúncias
- Alteração de status
- Download de relatórios em PDF

## 📦 Instalação

git clone https://github.com/yfgdavid/RecMap-Frontend
cd RecMap-Frontend
npm install
cp .env.example .env
npm run dev

text

**Acesse:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3333 (integração automática)

## 🔧 Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

VITE_API_URL=http://localhost:3333
VITE_PDF_URL=http://localhost:8000

text

## 📁 Estrutura do Projeto

src/
├── components/ # Componentes React
├── pages/ # Páginas da aplicação
├── services/ # Serviços e APIs
├── types/ # Tipos TypeScript
├── utils/ # Funções utilitárias
└── App.tsx # Componente principal

text

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Link do projeto: [https://rec-map-eta.vercel.app/](https://github.com/yfgdavid/RecMap-Frontend)

---

**RecMap** - Gestão Inteligente de Resíduos Urbanos 🌱