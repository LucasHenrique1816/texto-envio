import { useState, useEffect, useRef, useCallback } from 'react';

// Tipo para o usuário logado
export type LoggedUser = {
  login: string;
  nome_completo: string;
  role: string;
};

// Opções para configurar o comportamento do hook
export interface AutoFillNameOptions {
  /**
   * Se true, apenas preenche o nome se o campo estiver vazio inicialmente
   * Se false, sobrescreve o campo toda vez que loggedUser mudar
   */
  onlyFillIfEmpty?: boolean;
  
  /**
   * Se true, o campo ficará readonly quando preenchido automaticamente
   */
  makeReadOnly?: boolean;
  
  /**
   * Valor inicial para o campo nome
   */
  initialValue?: string;

  /**
   * Função para normalizar o valor antes de definir no estado
   * Útil para aplicar transformações como trim, por exemplo
   */
  normalize?: (value: string) => string;

  /**
   * Callback chamada quando o valor é preenchido automaticamente
   */
  onAutoFill?: (value: string) => void;

  /**
   * Se true, mantém a flag de auto-preenchido mesmo após edição manual
   * Padrão é false
   */
  keepAutoFilledFlagOnEdit?: boolean;

  /**
   * Se true, o hook reavalia sempre que o login do usuário mudar
   */
  watchUserChange?: boolean;
}

export interface UseAutoFillNameReturn {
  name: string;
  setName: (name: string) => void;
  isAutoFilled: boolean;
  isReadOnly: boolean;
}

/**
 * Hook personalizado para preencher automaticamente o campo nome
 * com base no usuário logado
 * 
 * @param loggedUser - Dados do usuário logado
 * @param options - Opções de configuração
 * @returns Objeto com estado e funções para gerenciar o campo nome
 * 
 * @example
 * ```tsx
 * const { name, setName, isAutoFilled, isReadOnly } = useAutoFillName(loggedUser, {
 *   onlyFillIfEmpty: true,
 *   makeReadOnly: false
 * });
 * ```
 */
export const useAutoFillName = (
  loggedUser?: LoggedUser | null,
  options: AutoFillNameOptions = {}
): UseAutoFillNameReturn => {
  const {
    onlyFillIfEmpty = true,
    makeReadOnly = false,
    initialValue = '',
    normalize,
    onAutoFill,
    keepAutoFilledFlagOnEdit = false,
    watchUserChange = true
  } = options;

  const normalizeFn = normalize || ((v: string) => v);

  const [name, setName] = useState(() => normalizeFn(initialValue));
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  useEffect(() => {
    if (!loggedUser?.nome_completo) return;

    const userChanged = loggedUser?.login !== loggedUser?.login;
    if (watchUserChange && !userChanged && onlyFillIfEmpty && name.trim()) return;
    if (onlyFillIfEmpty && name.trim() && !userChanged) return;

    const filled = normalizeFn(loggedUser.nome_completo);
    if (name !== filled) {
      setName(filled);
      setIsAutoFilled(true);
      onAutoFill?.(filled);
    }
  }, [loggedUser, onlyFillIfEmpty, watchUserChange, normalizeFn, name, onAutoFill]);

  const handleSetName = useCallback((newName: string) => {
    const normalized = normalizeFn(newName);
    setName(normalized);
    if (!keepAutoFilledFlagOnEdit && normalized !== loggedUser?.nome_completo) {
      setIsAutoFilled(false);
    }
  }, [normalizeFn, keepAutoFilledFlagOnEdit, loggedUser?.nome_completo]);

  // Determina se o campo deve ser readonly
  const isReadOnly = makeReadOnly && isAutoFilled;

  return {
    name,
    setName: handleSetName,
    isAutoFilled,
    isReadOnly
  };
};

export default useAutoFillName;