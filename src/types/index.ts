// This file is intentionally left blank.
export {};

export type Usuario = {
  id: string;
  login: string;
  senha_hash: string;
  nome_completo: string;
  role: 'user' | 'admin';
  criado_em: string;
};