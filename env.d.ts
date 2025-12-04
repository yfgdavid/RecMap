/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


// Arquivo de definições de tipos para variáveis de ambiente do Vite, se é local ou de produção