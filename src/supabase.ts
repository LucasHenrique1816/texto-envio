import { createClient } from '@supabase/supabase-js';

// Permite sobrescrever via variáveis de ambiente (Create React App -> prefixo REACT_APP_)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bwumlkhistzlvevtykyr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dW1sa2hpc3R6bHZldnR5a3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjk1MTIsImV4cCI6MjA2OTY0NTUxMn0._-8CV9vP8HrVy5tSNCqrJviH7fthS_aH88dGmXz2I9k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false,
	},
});

// Função utilitária para diagnosticar conectividade / políticas rapidamente.
export async function testSupabaseConnection() {
	try {
		const { data, error, status } = await supabase
			.from('usuarios')
			.select('login')
			.limit(1);
		if (error) {
			console.error('[SUPABASE][TEST] Falha ao consultar tabela usuarios:', { status, error });
			return { ok: false, error };
		}
		console.log('[SUPABASE][TEST] Conexão OK. Exemplo de retorno:', data);
		return { ok: true, data };
	} catch (e) {
		console.error('[SUPABASE][TEST] Erro inesperado:', e);
		return { ok: false, error: e };
	}
}