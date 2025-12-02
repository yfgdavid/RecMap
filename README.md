🖥️ RecMap Frontend

Interface web do RecMap, plataforma de mapeamento de resíduos urbanos, denúncias ambientais e painel governamental.

🚀 Tecnologias

React + TypeScript

Vite

TailwindCSS

Axios

Leaflet (mapa)

React Router

Recharts (gráficos)

✨ Funcionalidades
👤 Usuários

Login e cadastro

Recuperação de senha

🗺️ Mapa

Exibição de pontos de coleta

Exibição de denúncias

Filtros por tipo/status

Geolocalização do usuário

🚨 Denúncias

Criar denúncia com foto e localização automática

Listar e gerenciar denúncias do usuário

📍 Pontos de Coleta

Listagem e visualização no mapa

📊 Dashboard Governamental

KPIs

Gráficos

Lista de denúncias

Alteração de status

Download de PDF

📦 Instalação
git clone https://github.com/yfgdavid/RecMap-Frontend

cd RecMap-Frontend

npm install

cp .env.example .env

npm run dev


➡️ Frontend: http://localhost:5173

➡️ Backend: http://localhost:3333
 (integração automática)

🔧 Variáveis de Ambiente

Crie o arquivo .env:

VITE_API_URL=http://localhost:3333

VITE_PDF_URL=http://localhost:8000
