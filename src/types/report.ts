// Definição de tipos para uma denúncia no sistema Rec'Map

export interface Report {
  id_denuncia: number;
  titulo: string;
  descricao: string;
  localizacao: string | null;
  latitude?: number | null;
  longitude?: number | null;
  foto?: string | null;
  status: "PENDENTE" | "VALIDADA" | "ENCAMINHADA" | "RESOLVIDA";
  data_criacao: string;
  validacoes: {
    id_validacao: number;
    id_usuario: number;
    tipo_validacao: "CONFIRMAR" | "CONTESTAR";
    data_validacao: string;
  }[];
}