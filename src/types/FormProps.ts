// Tipo para as props que os formulários irão receber
export type FormProps = {
  loggedUser?: {
    login: string;
    nome_completo: string;
    role: string;
  } | null;
};
